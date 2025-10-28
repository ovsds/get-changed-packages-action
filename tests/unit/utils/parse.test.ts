import { describe, expect, test } from "vitest";

import { parseNonEmptyString, parseListOfStrings, parseRegex } from "../../../src/utils/parse";

describe("Parse utils tests", () => {
  test("parseNonEmptyString parses non-empty string correctly", () => {
    expect(parseNonEmptyString("test")).toBe("test");
  });

  test("parseNonEmptyString throws error when empty", () => {
    expect(() => parseNonEmptyString("")).toThrowError();
    expect(() => parseNonEmptyString(undefined)).toThrowError();
  });
});

describe("parseListOfStrings tests", () => {
  test("parseListOfStrings parses list of strings correctly", () => {
    expect(parseListOfStrings("test1,test2,test3", ",")).toEqual(["test1", "test2", "test3"]);
  });

  test("parseListOfStrings returns empty array when undefined", () => {
    expect(parseListOfStrings(undefined, ",")).toEqual([]);
  });

  test("parseListOfStrings returns empty array when empty string", () => {
    expect(parseListOfStrings("", ",")).toEqual([]);
  });
});

describe("parseRegex tests", () => {
  test("parseRegex parses regex correctly", () => {
    expect(parseRegex("test")).toStrictEqual(new RegExp("test"));
  });

  test("parseRegex throws error when invalid regex", () => {
    expect(() => parseRegex("test(")).toThrowError();
  });

  test("parseRegex throws error when undefined", () => {
    expect(() => parseRegex(undefined)).toThrowError();
  });

  test("parseRegex throws error when empty string", () => {
    expect(() => parseRegex("")).toThrowError();
  });
});
