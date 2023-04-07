import {IsNotEmpty} from "class-validator";

export class LoginDto {
    @IsNotEmpty({message: "tututu"})
    username: string;

    @IsNotEmpty()
    password: string;
}
