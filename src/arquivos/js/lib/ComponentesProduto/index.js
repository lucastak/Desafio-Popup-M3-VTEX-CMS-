import ModuloPrecoDe from "./SubModulos/ModuloPrecoDe";
import ModuloPrecoPor from "./SubModulos/ModuloPrecoPor";
import ModuloPrecoParcelado from "./SubModulos/ModuloPrecoParcelado";
import ModuloPrecoBoleto from "./SubModulos/ModuloPrecoBoleto";

import ModuloBtnQtd from "./SubModulos/ModuloBtnQtd";
import ModuloSelect from "./SubModulos/ModuloSelect";

import ModuloSkusPorNome from "./SubModulos/ModuloSkusPorNome";
import ModuloSkusPorEspecificacoes from "./SubModulos/ModuloSkusPorEspecificacoes";

import ModuloQuantidade from "./ModuloQuantidade";

import ModuloPreco from "./ModuloPreco";

import ModuloCompreJunto from "./ModuloCompreJunto";

import ModuloBotaoDeCompra from "./ModuloBotaoDeCompra";
import ModuloAviseMe from "./ModuloAviseMe";

import { ComponentStore } from "./store";

import {
	CHANGE_QTD,
	CHANGE_SKU,
	ADD_SKU_TO_CART_FAIL,
	ADD_SKU_TO_CART_SUCESS,
	SKU_REF,
} from "./EventType";

const Components = {
	ModuloAviseMe: ModuloAviseMe,
	ModuloBotaoDeCompra: ModuloBotaoDeCompra,
	ModuloCompreJunto: ModuloCompreJunto,
	ModuloPreco: ModuloPreco,
	ModuloQuantidade: ModuloQuantidade,
	ModuloSkusPorNome: ModuloSkusPorNome,
	ModuloSkusPorEspecificacoes: ModuloSkusPorEspecificacoes,
	ModuloBtnQtd: ModuloBtnQtd,
	ModuloPrecoBoleto: ModuloPrecoBoleto,
	ModuloPrecoDe: ModuloPrecoDe,
	ModuloPrecoParcelado: ModuloPrecoParcelado,
	ModuloPrecoPor: ModuloPrecoPor,
	ModuloSelect: ModuloSelect,
	ComponentStore,
	Events: {
		CHANGE_QTD,
		CHANGE_SKU,
		ADD_SKU_TO_CART_FAIL,
		ADD_SKU_TO_CART_SUCESS,
		SKU_REF,
	},
};

export default Components;
