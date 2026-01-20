import { numeric, pgView, text } from "drizzle-orm/pg-core";

export const produtoEmEstoqueMinimo = pgView("ProdutoEmEstoqueMinimo", {
  idProduto: text("id_produto"),
  skuProduto: text("sku_produto"),
  nomeProduto: text("nome_produto"),
  estoqueMinimo: numeric("estoque_minimo"),
  produtoSaldo: numeric("produto_saldo"),
  estoqueAtual: numeric("estoque_atual"),
  dataSaida: text("data_saida"),
}).existing();
