import { createSafeActionClient} from "next-safe-action"  

// Criar o cliente de ações:
export const actionClient = createSafeActionClient();

import {headers} from "next/headers"; 

import {auth} from "./auth"



// Criando uma protected action client 
export const protectedActionClient = actionClient.use( async ({next}) => {
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user && !session?.user.emailVerified) {
    throw new Error("Não autorizado. Necessário login ou verificação de email - Contate o suporte.");
  }

  return next({
    ctx: {
      user: session.user,
    },
  })
})


