# cnpj-alfanumerico-ts

Biblioteca TypeScript para validar, calcular, gerar e formatar CNPJ numérico e alfanumérico conforme as regras publicadas pela Receita Federal para vigência a partir de julho de 2026.

## Instalação

```bash
npm install @micajeho/cnpj-alfanumerico
```

**Requisitos:**
- Node.js 14+
- TypeScript 5+ (para desenvolvimento TypeScript)

> **Nota:** Este pacote suporta tanto ESM (ES Modules) quanto CommonJS.
> Inclui definições de tipos TypeScript (.d.ts) para melhor experiência de desenvolvimento.

## Uso

### ESM (Recomendado)

```ts
import {
  calculateCheckDigits,
  format,
  generate,
  validate,
  normalize,
} from "@micajeho/cnpj-alfanumerico";

calculateCheckDigits("12ABC34501DE");
// "35"

generate("12ABC34501DE");
// "12ABC34501DE35"

format("12ABC34501DE35");
// "12.ABC.345/01DE-35"

validate("12.ABC.345/01DE-35");
// true

normalize("12.ABC.345/01DE-35");
// "12ABC34501DE35"
```

### CommonJS

```js
const {
  calculateCheckDigits,
  format,
  generate,
  validate,
  normalize,
} = require("@micajeho/cnpj-alfanumerico");

// Use as mesmas funções acima
```

## Exemplos

### Validar e formatar CNPJ

```ts
import { validate, format, normalize } from "@micajeho/cnpj-alfanumerico";

const cnpj = "12.ABC.345/01DE-35";

if (validate(cnpj)) {
  const limpo = normalize(cnpj);     // "12ABC34501DE35"
  const formatado = format(limpo);    // "12.ABC.345/01DE-35"
  console.log(`CNPJ válido: ${formatado}`);
} else {
  console.log("CNPJ inválido");
}
```

### Gerar CNPJ a partir da base

```ts
import { generate, format } from "@micajeho/cnpj-alfanumerico";

const base = "12ABC34501DE";
const cnpjCompleto = generate(base);        // "12ABC34501DE35"
const cnpjFormatado = format(cnpjCompleto); // "12.ABC.345/01DE-35"
```

### Dividir CNPJ em partes

```ts
import { split } from "@micajeho/cnpj-alfanumerico";

const partes = split("12ABC34501DE35");
console.log(partes.raiz);   // "12ABC345"
console.log(partes.ordem);  // "01DE"
console.log(partes.dv);     // "35"
```

## API

### Funções principais

- **`normalize(value: string): string`** - Remove formatação e converte para maiúsculas
- **`validate(cnpj: string): boolean`** - Valida se o CNPJ é válido (com ou sem formatação)
- **`format(cnpj: string): string`** - Formata o CNPJ no padrão XX.XXX.XXX/XXXX-XX
- **`generate(base12: string): string`** - Gera CNPJ completo a partir dos 12 primeiros caracteres
- **`calculateCheckDigits(base12: string): string`** - Calcula os 2 dígitos verificadores

### Funções auxiliares

- **`isFormatted(cnpj: string): boolean`** - Verifica se o CNPJ está formatado
- **`split(cnpj: string): CnpjParts`** - Divide o CNPJ em raiz (8), ordem (4) e DV (2)
- **`assertValid(cnpj: string): string`** - Valida e retorna o CNPJ normalizado ou lança erro
- **`charValue(char: string): number`** - Retorna o valor numérico de um caractere (0-9, A-Z)

### Tipo

```ts
type CnpjParts = {
  raiz: string;   // 8 primeiros caracteres
  ordem: string;  // caracteres 9-12
  dv: string;     // 2 dígitos verificadores
};
```

## Regras implementadas

- Aceita `0-9` e `A-Z` nos 12 primeiros caracteres.
- Mantém os 2 dígitos verificadores numéricos.
- Usa módulo 11 com pesos `5..2,9..2` no primeiro DV e `6..2,9..2` no segundo.
- Para letras, usa `ASCII - 48`, por exemplo `A=17` e `Z=42`.
- Continua compatível com CNPJ numérico existente.

## Publicação

```bash
npm version patch
npm publish --access public
```

Antes de publicar, ajuste `repository`, `bugs`, `homepage` e o `name` do pacote se necessário.

## Referências

- Receita Federal: projeto CNPJ alfanumérico
- Receita Federal: manual de cálculo do DV
