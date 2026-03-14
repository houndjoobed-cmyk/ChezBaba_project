import React from "react";

import * as motion from "framer-motion/client";

// Components
import ProductCard from "./ProductCard";
import AnimatedButton from "@/components/ui/AnimatedButton";

// UI Components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Utils & Types
import { cn } from "@/lib/utils";
import { ProductFromAPI } from "@/lib/types/product.types";

// Styles
import { satoshi } from "@/styles/fonts";

type ProductListSecProps = {
  title: string;
  description?: string;
  viewAllLink?: string;
  data: ProductFromAPI[];
};

const ProductListSec = ({
  title,
  description,
  data,
  viewAllLink,
}: ProductListSecProps) => {
  return (
    <section className="max-w-frame mx-auto text-center">
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn([
          satoshi.className,
          `text-[32px] md:text-5xl capitalize text-[var(--darkblue)] ${description ? "mb-2 md:mb-4" : "mb-8 md:mb-14"
          }`,
        ])}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ y: "100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm md:text-base text-gray-600 mb-8 md:mb-14"
        >
          {description}
        </motion.p>
      )}
      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full mb-6 md:mb-9"
        >
          <CarouselContent className="mx-4 xl:mx-0 space-x-4 sm:space-x-5">
            {data.map((product) => (
              <CarouselItem
                key={product.id}
                className="w-full max-w-[198px] sm:max-w-[295px] pl-0"
              >
                <ProductCard data={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {viewAllLink && (
          <div className="w-full px-4 sm:px-0 text-center">
            <AnimatedButton href={viewAllLink}>
              Voir tout
            </AnimatedButton>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
