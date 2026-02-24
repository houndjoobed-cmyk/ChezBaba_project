import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { productSchema, formatValidationErrors } from "@/lib/validations";
import {
  getPaginationParams,
  getSortingProductsParams,
} from "@/lib/utils/params";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/lib/helpers/cloudinary";

// Fetch all products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const searchQuery = searchParams.get("q"); // Retrieve search query
  const { page, pageSize, skip } = getPaginationParams(req);
  const { sortBy, sortOrder } = getSortingProductsParams(req);

  try {
    // Build where clause
    const whereClause: Prisma.ProduitWhereInput = {
      ...(type === "boutique" && { produitBoutique: { isNot: null } }),
      ...(type === "marketplace" && { produitMarketplace: { isNot: null } }),
      ...(searchQuery && {
        nom: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    };

    // Fetch all products & count
    const totalProducts = await prisma.produit.count({ where: whereClause });
    const products = await prisma.produit.findMany({
      where: whereClause,
      select: getProductSelect(),
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    });

    // Format products
    const data = products.map((product) => formatProductData(product));

    // Pagination response
    const pagination = {
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      pageSize,
    };

    // Return response
    return NextResponse.json(
      {
        message: "Les produits ont été récupérés avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/products] : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(req: NextRequest) {
  try {
    // Authentication Check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const isVendeur = session.user.role === UserRole.VENDEUR;
    const isAdmin = session.user.role === UserRole.ADMIN;

    if (!isVendeur && !isAdmin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Validate and Parse Form Data
    const formData = await req.formData();
    const inputData = {
      nom: formData.get("nom"),
      objet: formData.get("objet") || undefined,
      description: formData.get("description") || undefined,
      prix: formData.get("prix") !== null ? Number(formData.get("prix")) : undefined,
      qteStock: formData.get("qteStock") !== null ? Number(formData.get("qteStock")) : undefined,
      categorieId: formData.get("categorieId") || undefined,
      genreId: formData.get("genreId") || undefined,
      delaiLivraison: formData.get("delaiLivraison") || undefined,
      garantie: formData.get("garantie") || undefined,
      prixPromo: formData.get("prixPromo") !== null ? Number(formData.get("prixPromo")) : undefined,
      couleurs: formData.getAll("couleurs"),
      tailles: formData.getAll("tailles"),
      images: formData.getAll("images"),
      video: formData.get("video") instanceof File ? formData.get("video") : undefined,
      fournisseur: formData.get("fournisseur") || undefined,
    };

    const parsedData = productSchema.safeParse(inputData);

    if (!parsedData.success) {
      console.error("Validation failed for product creation:");
      console.error("Input data:", inputData);
      console.error("Issues:", JSON.stringify(parsedData.error.issues, null, 2));
      return formatValidationErrors(parsedData);
    }

    // Upload Images to Cloudinary
    const { images, video } = parsedData.data;
    let uploadedImages: string[] = [];
    let uploadedVideo: string | null = null;

    try {
      uploadedImages = await Promise.all(
        images.map(async (image) => {
          const result = await uploadToCloudinary(image, "products");
          return result.public_id;
        })
      );

      if (video) {
        const videoResult = await uploadToCloudinary(video, "products", "video");
        uploadedVideo = videoResult.public_id;
      }
    } catch (uploadError) {
      console.error("Media upload failed:", uploadError);
      return NextResponse.json(
        { error: "Échec du téléversement des médias." },
        { status: 500 }
      );
    }

    // Attempt to Create Product in Database
    try {
      const product = await prisma.produit.create({
        data: {
          nom: parsedData.data.nom,
          prix: parsedData.data.prix,
          qteStock: parsedData.data.qteStock,
          objet: parsedData.data.objet,
          description: parsedData.data.description,
          categorie: parsedData.data.categorieId
            ? { connect: { id: parsedData.data.categorieId } }
            : undefined,
          genre: parsedData.data.genreId
            ? { connect: { id: parsedData.data.genreId } }
            : undefined,
          delaiLivraison: parsedData.data.delaiLivraison,
          garantie: parsedData.data.garantie,
          prixPromo: parsedData.data.prixPromo,
          couleurs: parsedData.data.couleurs?.length
            ? {
              connect: parsedData.data.couleurs.map((id: string) => ({ id })),
            }
            : undefined,
          tailles: parsedData.data.tailles?.length
            ? {
              connect: parsedData.data.tailles.map((id: string) => ({ id })),
            }
            : undefined,
          images: {
            create: uploadedImages.map((publicId) => ({
              imagePublicId: publicId,
            })),
          },
          video: uploadedVideo
            ? {
              create: {
                videoPublicId: uploadedVideo,
              },
            }
            : undefined,
          ...(isVendeur && {
            produitMarketplace: {
              create: {
                vendeurId: session.user.id,
              },
            },
          }),
          ...(isAdmin && {
            produitBoutique: {
              create: {
                fournisseur: parsedData.data.fournisseur as string | undefined,
              },
            },
          }),
        },
        select: getProductSelect(),
      });

      const data = formatProductData(product);

      return NextResponse.json(
        { message: "Produit créé avec succès", data },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);

      // If product creation fails, delete the uploaded images/video
      await Promise.all([
        ...uploadedImages.map(async (publicId) => {
          try {
            await deleteFromCloudinary(publicId);
          } catch (deleteError) {
            console.error(`Failed to delete image ${publicId}:`, deleteError);
          }
        }),
        ...(uploadedVideo ? [
          (async () => {
            try {
              await deleteFromCloudinary(uploadedVideo!, "video");
            } catch (deleteError) {
              console.error(`Failed to delete video ${uploadedVideo}:`, deleteError);
            }
          })()
        ] : [])
      ]);

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === "P2025") {
          return NextResponse.json(
            { error: ERROR_MESSAGES.BAD_REQUEST_ID },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error [POST /api/products] :", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// DELETE all products
export async function DELETE(_req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  try {
    let produitsToDelete;
    let message;

    switch (session.user.role) {
      case UserRole.ADMIN:
        // Get all boutique products and their images
        produitsToDelete = await prisma.produit.findMany({
          where: {
            produitBoutique: {
              isNot: null,
            },
          },
          select: {
            id: true,
            images: true,
          },
        });
        message = "Tous les produits boutique ont été supprimés avec succès.";
        break;

      case UserRole.VENDEUR:
        // Get vendor's marketplace products and their images
        produitsToDelete = await prisma.produit.findMany({
          where: {
            produitMarketplace: {
              vendeurId: session.user.id,
            },
          },
          select: {
            id: true,
            images: true,
          },
        });
        message = "Tous vos produits ont été supprimés avec succès.";
        break;

      default:
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
    }

    // Delete all related images from Cloudinary

    // Uncomment the following lines if you want to delete images from Cloudinary
    // Keep it commented for now to avoid accidental deletions

    // await Promise.all(
    //   produitsToDelete.flatMap((produit) =>
    //     (produit.images || []).map((img) =>
    //       deleteFromCloudinary(img.imagePublicId)
    //     )
    //   )
    // );

    // Delete all products
    const deleted = await prisma.produit.deleteMany({
      where: {
        id: {
          in: produitsToDelete.map((p) => p.id),
        },
      },
    });

    return NextResponse.json(
      {
        message,
        count: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/products]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
