import test from "node:test";
import assert from "node:assert/strict";

import {
  assertValid,
  calculateCheckDigits,
  charValue,
  format,
  generate,
  isFormatted,
  normalize,
  split,
  validate,
} from "../dist/index.js";

test("normalizes punctuation and lowercase", () => {
  assert.equal(normalize("12.abc.345/01de-35"), "12ABC34501DE35");
});

test("maps alphanumeric values using ASCII minus 48", () => {
  assert.equal(charValue("0"), 0);
  assert.equal(charValue("9"), 9);
  assert.equal(charValue("A"), 17);
  assert.equal(charValue("Z"), 42);
});

test("calculates official Receita example", () => {
  assert.equal(calculateCheckDigits("12ABC34501DE"), "35");
  assert.equal(generate("12ABC34501DE"), "12ABC34501DE35");
  assert.equal(format("12ABC34501DE35"), "12.ABC.345/01DE-35");
  assert.equal(validate("12.ABC.345/01DE-35"), true);
});

test("validates legacy numeric CNPJ", () => {
  assert.equal(validate("11.444.777/0001-61"), true);
  assert.equal(format("11444777000161"), "11.444.777/0001-61");
});

test("rejects invalid values", () => {
  assert.equal(validate("12.ABC.345/01DE-36"), false);
  assert.equal(validate("12.ABC.345/01DE-3X"), false);
  assert.throws(() => calculateCheckDigits("ABC"), /12 alphanumeric/);
});

test("splits and asserts valid cnpj", () => {
  assert.deepEqual(split("12.ABC.345/01DE-35"), {
    raiz: "12ABC345",
    ordem: "01DE",
    dv: "35",
  });
  assert.equal(assertValid("12.ABC.345/01DE-35"), "12ABC34501DE35");
  assert.throws(() => assertValid("12.ABC.345/01DE-36"), /Invalid CNPJ/);
});

test("detects formatted values", () => {
  assert.equal(isFormatted("12.ABC.345/01DE-35"), true);
  assert.equal(isFormatted("12ABC34501DE35"), false);
});
