import { map, type Observable } from "rxjs";
import type { ZodType } from "zod/v4";

type ParsedResult<Validator extends ZodType, Result> = Result extends Array<unknown> ? Array<ReturnType<Validator["parse"]>> : ReturnType<Validator["parse"]>;

export const resultValidator = <Validator extends ZodType, Result>(value: Observable<Result>, validator: Validator):Observable<ParsedResult<Validator, Result>> => {
    return value.pipe(map(result => {
        if(!Array.isArray(result)) {
            return validator.parse(result) as ParsedResult<Validator, Result>
        }
        return result.map(value => validator.parse(value)) as ParsedResult<Validator, Result>
    }))
}