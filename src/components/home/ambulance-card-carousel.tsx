"use client";

import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AmbulanceCardsCarousel() {
  const cards = ambulanceData.map((card, index) => (
    <Card key={card._id} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <h2 className="max-w-4xl mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Closest ambulance available.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-4 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const ambulanceData = [
  {
    _id: "1",
    image:
      "https://images.pexels.com/photos/17809395/pexels-photo-17809395/free-photo-of-an-ambulance-of-the-chicago-fire-department-on-the-street.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+1 234 567 890",
    plate: "AB-1234",
    distance: "2.5 km",
    title: "You can do more with AI.",
    content: <DummyContent />,
  },
  {
    _id: "2",
    image:
      "https://images.pexels.com/photos/3584101/pexels-photo-3584101.jpeg?auto=compress&cs=tinysrgb&w=600",
    phone: "+1 987 654 321",
    plate: "CD-5678",
    distance: "4.0 km",
    title: "You can do more with AI.",
    content: <DummyContent />,
  },
  {
    _id: "3",
    image:
      "https://images.pexels.com/photos/6519838/pexels-photo-6519838.jpeg?auto=compress&cs=tinysrgb&w=600",
    phone: "+1 345 678 901",
    plate: "EF-9012",
    distance: "6.2 km",
    title: "You can do more with AI.",
    content: <DummyContent />,
  },
  {
    _id: "4",
    image:
      "https://images.pexels.com/photos/6519847/pexels-photo-6519847.jpeg?auto=compress&cs=tinysrgb&w=600",
    phone: "+1 456 789 012",
    plate: "GH-3456",
    distance: "8.7 km",
    title: "You can do more with AI.",
    content: <DummyContent />,
  },
];
