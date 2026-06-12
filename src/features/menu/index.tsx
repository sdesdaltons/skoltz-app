"use client"

import { useState } from "react"

import { SbBadge, SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

type FoodMenuItem = {
  name: string
  price?: string
  description?: string
}

type FoodMenuSection = {
  title: string
  items: FoodMenuItem[]
}

type WingSauce = {
  name: string
  style: string
  tone: "red" | "warning" | "success" | "neutral"
}

const wingSauces = [
  { name: "3 Pepper Fire", style: "Hot", tone: "red" },
  { name: "Cajun Heat", style: "Hot", tone: "red" },
  { name: "Flaming Honey", style: "Sweet Heat", tone: "warning" },
  { name: "Garlic", style: "Savory", tone: "neutral" },
  { name: "Franks Hot", style: "Classic Hot", tone: "red" },
  { name: "Skoltz Hot", style: "House Hot", tone: "red" },
  { name: "Spicy BBQ", style: "Smoky Heat", tone: "warning" },
  { name: "Mango Habanero", style: "Fruit Heat", tone: "red" },
  { name: "Jumanji", style: "Bold", tone: "warning" },
  { name: "Gochujang", style: "Korean Heat", tone: "red" },
  { name: "Gold Rush", style: "Tangy", tone: "warning" },
  { name: "Lemon Pepper", style: "Dry Rub", tone: "success" },
  { name: "Saucey Garlic Parm", style: "Creamy", tone: "neutral" },
  { name: "Garlic Parm Rub", style: "Dry Rub", tone: "success" },
  { name: "Naked", style: "No Sauce", tone: "neutral" },
] satisfies WingSauce[]

export const foodMenuSections = [
  {
    title: "Appetizers",
    items: [
      { name: "Bottlecaps", price: "$5.00" },
      { name: "Mozzarella Styx", price: "$5.00", description: "Ranch or marinara." },
      {
        name: "Wisconsin Cheese Curds",
        price: "$6.00",
        description: "Remolade or ranch.",
      },
      {
        name: "Pretzel Bites",
        price: "$4.00",
        description: "Mustard or add queso for $2.",
      },
      { name: "Mini Corndogs", price: "$4.50", description: "Mustard and ketchup." },
      {
        name: "Taquitos",
        price: "$5.00",
        description: "Salsa, sour cream or hot sauce. Add queso for $0.75.",
      },
      {
        name: "Chips and Queso",
        price: "$5.00",
        description: "Add taco meat for $2.",
      },
      { name: "Chili Cheese Fries", price: "$5.25", description: "With queso." },
      { name: "Frito Pie", price: "$5.50", description: "With shredded cheese." },
      { name: "Southwest Eggrolls", price: "$6.00" },
      { name: "Fries or Tots", price: "$2.00/$4.50", description: "Side or basket." },
      { name: "Onion Rings", price: "$4.00/$7.50", description: "Side or basket." },
      {
        name: "Funnel Cake Fries",
        price: "$5.00",
        description: "Chocolate, strawberry or caramel syrup.",
      },
    ],
  },
  {
    title: "Burgers and Sammies",
    items: [
      {
        name: "1/4 lb Burger w/fries",
        price: "$7.00",
        description:
          "Lettuce, tomato, pickle, onion and mustard. Ketchup upon request.",
      },
      {
        name: "Burger Add Ons",
        description:
          "Cojack, pepperjack or provolone $1. Jalapeno $0.50. Bacon $1.50. Fried egg $1. Double patty $2. Sub onion rings $2.",
      },
      {
        name: "Philly Cheese Steak",
        price: "$10.00",
        description: "Onions, bell pepper and provolone. Add mushrooms for $0.50.",
      },
      {
        name: "Texas Philly",
        price: "$10.00",
        description:
          "Onions, bell pepper, jalapeno and pepperjack. Add mushrooms for $0.50.",
      },
      { name: "Pulled Pork w/chips", price: "$6.25" },
      {
        name: "Club w/chips",
        price: "$10.00",
        description: "Ham, turkey, bacon, cojack, lettuce, tomato and mayo.",
      },
      { name: "BLT w/chips", price: "$6.75" },
      {
        name: "Hot Dog",
        price: "$2.75",
        description:
          "Mayo, ketchup, yellow or brown mustard, pico, onions, relish, tomato. Add shredded cheese, queso, chili or sauerkraut for $0.50.",
      },
    ],
  },
  {
    title: "Breakfast",
    items: [
      {
        name: "Breakfast Taco",
        price: "$3.50",
        description: "Sausage, egg and cheese on corn or flour. Salsa upon request.",
      },
      {
        name: "Breakfast Bowl",
        price: "$7.50",
        description:
          "Scrambled eggs with onion, bell pepper, sausage, cheese and tater tots.",
      },
      {
        name: "Breakfast Pizza",
        price: "$15.00",
        description: "Country gravy, cheese, sausage and eggs.",
      },
    ],
  },
  {
    title: "Tacos and Nachos",
    items: [
      {
        name: "Shredded Chicken or Ground Beef Taco",
        price: "$3.00",
        description:
          "Corn or flour tortillas with cheese, lettuce, pico, jalapeno and sour cream.",
      },
      {
        name: "Nacho Grande",
        price: "$11.95",
        description: "Chicken or beef, queso, lettuce, pico, jalapenos and sour cream.",
      },
      { name: "Half Order Nachos", price: "$8.50" },
    ],
  },
  {
    title: "Specialty Pizzas",
    items: [
      {
        name: "Supreme",
        price: "$13.50",
        description: "Cheese, pepperoni, sausage, mushrooms, onion and bell pepper.",
      },
      {
        name: "Taco Pizza",
        price: "$13.50",
        description:
          "Salsa, taco meat and cheese, topped with lettuce, pico and sour cream.",
      },
      {
        name: "Meat Lovers",
        price: "$15.00",
        description: "Pepperoni, sausage, bacon and taco meat.",
      },
      {
        name: "Philly Pizza",
        price: "$15.00",
        description: "Garlic butter, philly meat, onion and bell pepper.",
      },
      {
        name: "Buffalo Chicken Pizza",
        price: "$15.00",
        description: "Skoltz hot sauce, chicken strippers, onion and ranch.",
      },
      {
        name: "Build a Pizza",
        price: "$9.00",
        description:
          "Meat $1.50 each: pepperoni, sausage, taco meat, bacon. Veggies $0.50 each: onion, tomato, jalapeno, mushroom, bell pepper, black olive, pico.",
      },
    ],
  },
  {
    title: "Wings and Things",
    items: [
      {
        name: "Bone-In Wings",
        price: "6 for $8.00 / 12 for $15.00",
        description:
          "Tossed in wing sauce and served with celery, carrots and ranch or bleu cheese. Extra veggies and dip $1. Extra dip $0.50.",
      },
      {
        name: "Boneless Chicken Strippers",
        price: "$5.50",
        description:
          "Tossed in wing sauce with ranch or bleu cheese. Add celery and carrots for $1. Extra dip $0.50. Side of gravy $1.",
      },
      {
        name: "Stripper Sandwich",
        price: "$10.00",
        description:
          "Tossed in wing sauce and topped with lettuce, tomato, pickles, onion and mayo. Add cheese for $1: cojack, pepperjack or provolone.",
      },
      {
        name: "Buffalo Wedgie Salad",
        price: "$10.00",
        description:
          "Iceberg wedge with pico, bacon bits and cojack shreds. Strippers or thighs tossed in sauce. Choose ranch or bleu cheese.",
      },
    ],
  },
] satisfies FoodMenuSection[]

const categoryFilters = ["All", ...foodMenuSections.map((section) => section.title)] as const

function WingSauceGrid() {
  return (
    <div className="space-y-2 rounded-md border border-primary/20 bg-primary/6 p-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-foreground">Wing Sauces</h4>
        <SbBadge tone="blue">Choose one</SbBadge>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {wingSauces.map((sauce) => (
          <div
            key={sauce.name}
            className="min-h-16 rounded-md border border-border/70 bg-background/80 p-2"
          >
            <p className="text-sm font-semibold leading-5 text-foreground">
              {sauce.name}
            </p>
            <SbBadge tone={sauce.tone} className="mt-1">
              {sauce.style}
            </SbBadge>
          </div>
        ))}
      </div>
    </div>
  )
}

function FoodMenuCard({ section }: { section: FoodMenuSection }) {
  const isWingsSection = section.title === "Wings and Things"

  return (
    <SbCard className="h-full space-y-3 border-border/70 bg-surface-2 p-3">
      <div className="flex items-center justify-between gap-3 border-b border-warning/25 pb-2">
        <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
        <SbBadge tone="neutral">{section.items.length} items</SbBadge>
      </div>

      <div className="divide-y divide-border/50">
        {section.items.map((item) => (
          <div key={item.name} className="py-2 first:pt-0 last:pb-0">
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              {item.price ? (
                <>
                  <span
                    aria-hidden
                    className="min-w-4 flex-1 border-b border-dotted border-border/80"
                  />
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-warning">
                    {item.price}
                  </p>
                </>
              ) : null}
            </div>
            {item.description ? (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {isWingsSection ? <WingSauceGrid /> : null}
    </SbCard>
  )
}

export function FoodMenuGrid() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categoryFilters)[number]>("All")
  const visibleSections =
    activeCategory === "All"
      ? foodMenuSections
      : foodMenuSections.filter((section) => section.title === activeCategory)

  const totalItems = foodMenuSections.reduce(
    (count, section) => count + section.items.length,
    0
  )

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {categoryFilters.map((category) => {
          const isActive = category === activeCategory
          const itemCount =
            category === "All"
              ? totalItems
              : foodMenuSections.find((section) => section.title === category)
                  ?.items.length ?? 0

          return (
            <button
              key={category}
              type="button"
              className={cn(
                "min-h-16 rounded-lg border p-2.5 text-left transition-colors",
                isActive
                  ? "border-warning/60 bg-warning/15 shadow-[0_0_0_1px_rgb(255_176_32_/_0.18),0_0_14px_rgb(255_176_32_/_0.12)]"
                  : "border-border bg-surface-2 hover:border-warning/40"
              )}
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
            >
              <p
                className={cn(
                  "text-sm font-bold leading-5",
                  isActive ? "text-warning" : "text-foreground"
                )}
              >
                {category === "All" ? "Full Menu" : category}
              </p>
              <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {itemCount} items
              </p>
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {visibleSections.map((section) => (
          <FoodMenuCard key={section.title} section={section} />
        ))}
      </div>
    </div>
  )
}
