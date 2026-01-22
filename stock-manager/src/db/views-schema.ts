import { date, numeric, pgTable, pgView, text } from "drizzle-orm/pg-core";

export const produtoEmEstoqueMinimo = pgView("ProdutoEmEstoqueMinimo", {
  idProduto: text("id_produto"),
  skuProduto: text("sku_produto"),
  nomeProduto: text("nome_produto"),
  estoqueMinimo: numeric("estoque_minimo"),
  produtoSaldo: numeric("produto_saldo"),
  estoqueAtual: numeric("estoque_atual"),
  dataSaida: text("data_saida"),
}).existing();

export const saidaProdutoDiario = pgView("SaidaProdutoDiario", {
  skuProduto: text("sku_produto"),
  nomeProduto: text("nome_produto"),
  somaQtdVenda: numeric("soma_qtd_venda"),
  data: date("data"),
}).existing();


export const produtoEstoque = pgTable(
  "produto_estoque", {
    idProduto: text("id_produto"),
    produtoEstoqueMinimo: numeric("produto_estoque_minimo"),
    produtoEstoqueMaximo: numeric("produto_estoque_maximo"),
    produtoSaldo: numeric("produto_saldo"),
    produtoSaldoReservado: numeric("produto_saldo_reservado"),
    produtoSaldoDisponivel: numeric("produto_saldo_disponivel"),
    updatedAt: text("update_at"),
  }
);

export const produto = pgTable(
  "produto", {
    idProduto: text("id_produto").primaryKey(),
    skuProduto: text("sku_produto").notNull(),
    nomeProduto: text("nome_produto").notNull(),
    tipoProduto: text("tipo_produto"),
    situacaoProduto: text("situacao_produto"),
    tipoVariacaoProduto: text("tipo_variacao_produto"),
    classeProduto: text("classe_produto"),
    updateAt: text("update_at"),
  }
);

