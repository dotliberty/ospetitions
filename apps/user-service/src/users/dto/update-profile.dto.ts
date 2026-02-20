import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    displayName?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    preferredCategories?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    preferredTags?: string[];
}
