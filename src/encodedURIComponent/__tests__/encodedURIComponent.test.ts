/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, test } from "vitest";

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "..";
import { getTestData, runTestSet } from "../../__tests__/testFunctions";

describe("encodedURIComponent", () => {
    runTestSet("encodeduri", compressToEncodedURIComponent, decompressFromEncodedURIComponent);

    const test_longString = getTestData("pi");
    const compressedLongString = compressToEncodedURIComponent(test_longString)!;

    test(`All chars are URL safe`, ({ expect }) => {
        expect.soft(compressedLongString.indexOf("=")).toBe(-1);
        expect.soft(compressedLongString.indexOf("/")).toBe(-1);
        expect.soft(decompressFromEncodedURIComponent(compressedLongString)).toBe(test_longString);
    });

    test(`+ and ' ' are interchangeable in decompression`, ({ expect }) => {
        /** Known output for URI compression */
        const test_withSpace =
            "CIVwTglgdg5gBAFwIYIQezdGAaO0DWeAznlAFYCmAxghQCanqIAWFcR 0u0ECEKWOEih4AtqJBQ2YCkQAOaKEQq5hDKhQA2mklSTb6cAESikVMGjnMkMWUbii0ANzbQmCVkJlIhUBkYoUOBA5ew9XKHwAOjgAFU9Tc0trW10kMDAAT3Y0UTY0ADMWCMJ3TwAjNDpMgHISTUzRKzgoKtlccpAEHLyWIPS2AogDBgB3XmZSQiJkbLku3ApRcvo6Q2hi9k4oGPiUOrhR627TfFlN5FQMOCcIIghyzTZJNbBNjmgY4H1mNBB7tgAVQgLjA9wQtRIAEEnlQ4AAxfRnKDWUTEOBrFyaSyCHzoOQQPSaODmQJojxBUZoMD4EjlbLIMC2PiwTaJCxWGznCndawuOAyUzQQxBcLsXj5Ipiy7oNAxAByFFGDjMHJS50c-I2TCoiiIIF6YrkMlufyIDTgBJgeSgCAAtEMRiqkpzUr4GOERKIIDAwCg2GU2A0mpNWmsiIsXLaQPoLchtvBY5tqmxxh5iqIYkYAOqsES6prpQS8RBoOCaJDKMB28qVwwy66C5z6bgiI6EyaZP7sCgBirgJS4MVEPQZLBDiqaO60MGtlh3El13CjCg1fnhn1SBg OhgEDwHkYtCyKA1brebTZPlsCRUSaFAp2xnMuAUAoFagIbD2TxEJAQOgs2zVcZBaNBumfCgWUTKBskKTZWjAUxiQ fMtB0XAiDLLsQEORQzx7NgfGxbp4OgAoK3EARFBiABJEQCjML84FrZQGEUTZjTQDQiBIQ8VxqUCmJjS9gnuWBlzYOh8Ig5gCGKUDxm0FiiNg0gKKQKi A4-plLUPBuipEBNG3GgRItFZfD4O1yMo0x0CyKIgAAA$$";

        /** Known output for URI compression with different (valid) input */
        const test_withPlus =
            "CIVwTglgdg5gBAFwIYIQezdGAaO0DWeAznlAFYCmAxghQCanqIAWFcR+0u0ECEKWOEih4AtqJBQ2YCkQAOaKEQq5hDKhQA2mklSTb6cAESikVMGjnMkMWUbii0ANzbQmCVkJlIhUBkYoUOBA5ew9XKHwAOjgAFU9Tc0trW10kMDAAT3Y0UTY0ADMWCMJ3TwAjNDpMgHISTUzRKzgoKtlccpAEHLyWIPS2AogDBgB3XmZSQiJkbLku3ApRcvo6Q2hi9k4oGPiUOrhR627TfFlN5FQMOCcIIghyzTZJNbBNjmgY4H1mNBB7tgAVQgLjA9wQtRIAEEnlQ4AAxfRnKDWUTEOBrFyaSyCHzoOQQPSaODmQJojxBUZoMD4EjlbLIMC2PiwTaJCxWGznCndawuOAyUzQQxBcLsXj5Ipiy7oNAxAByFFGDjMHJS50c-I2TCoiiIIF6YrkMlufyIDTgBJgeSgCAAtEMRiqkpzUr4GOERKIIDAwCg2GU2A0mpNWmsiIsXLaQPoLchtvBY5tqmxxh5iqIYkYAOqsES6prpQS8RBoOCaJDKMB28qVwwy66C5z6bgiI6EyaZP7sCgBirgJS4MVEPQZLBDiqaO60MGtlh3El13CjCg1fnhn1SBg+OhgEDwHkYtCyKA1brebTZPlsCRUSaFAp2xnMuAUAoFagIbD2TxEJAQOgs2zVcZBaNBumfCgWUTKBskKTZWjAUxiQ+fMtB0XAiDLLsQEORQzx7NgfGxbp4OgAoK3EARFBiABJEQCjML84FrZQGEUTZjTQDQiBIQ8VxqUCmJjS9gnuWBlzYOh8Ig5gCGKUDxm0FiiNg0gKKQKi+A4-plLUPBuipEBNG3GgRItFZfD4O1yMo0x0CyKIgA";

        expect
            .soft(decompressFromEncodedURIComponent(test_withSpace))
            .toEqual(decompressFromEncodedURIComponent(test_withPlus));
    });
});
