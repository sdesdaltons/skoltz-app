import { SbBadge, SbCard } from "@/components/ui"

type FoodMenuItem = {
  name: string
  price?: string
  description?: string
}

type FoodMenuSection = {
  title: string
  items: FoodMenuItem[]
}

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
      {
        name: "Wing Sauces",
        description:
          "3 Pepper Fire, Cajun Heat, Flaming Honey, Garlic, Franks Hot, Skoltz Hot, Spicy BBQ, Mango Habanero, Jumanji, Gochujang, Gold Rush, Lemon Pepper, Saucey Garlic Parm, Garlic Parm Rub, Naked.",
      },
    ],
  },
] satisfies FoodMenuSection[]

function FoodMenuCard({ section }: { section: FoodMenuSection }) {
  return (
    <SbCard className="h-full space-y-3 border-border/70 bg-surface-2 p-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
        <SbBadge tone="neutral">Menu</SbBadge>
      </div>

      <div className="divide-y divide-border/70">
        {section.items.map((item) => (
          <div key={item.name} className="py-2 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              {item.price ? (
                <p className="shrink-0 text-sm font-semibold tabular-nums text-primary">
                  {item.price}
                </p>
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
    </SbCard>
  )
}

export function FoodMenuGrid() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {foodMenuSections.map((section) => (
        <FoodMenuCard key={section.title} section={section} />
      ))}
    </div>
  )
}
