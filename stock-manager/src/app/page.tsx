"use client"

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";


const handleClick = () => {
  redirect("/dashboard")
}


export default function Home() {

  return (
    <div className="flex items-center h-screen justify-center">
      <Button variant="outline" onClick={handleClick}>Acessar painel administrativo</Button>
      {/* <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button> */}
    </div>
  );
}
