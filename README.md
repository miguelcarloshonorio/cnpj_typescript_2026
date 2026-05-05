# cnpj-alfanumerico-ts

Biblioteca TypeScript para validar, calcular, gerar e formatar CNPJ numérico e alfanumérico conforme as regras publicadas pela Receita Federal para vigência a partir de julho de 2026.

## Instalação

```bash
npm install @miguelhonorio/cnpj-alfanumerico
```

## Uso

```ts
import {
  calculateCheckDigits,
  format,
  generate,
  validate,
} from "@miguelhonorio/cnpj-alfanumerico";

calculateCheckDigits("12ABC34501DE");
// "35"

generate("12ABC34501DE");
// "12ABC34501DE35"

format("12ABC34501DE35");
// "12.ABC.345/01DE-35"

validate("12.ABC.345/01DE-35");
// true
```

## API

- `normalize(value)`
- `charValue(char)`
- `calculateCheckDigits(base12)`
- `generate(base12)`
- `validate(cnpj)`
- `assertValid(cnpj)`
- `format(cnpj)`
- `isFormatted(cnpj)`
- `split(cnpj)`

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
