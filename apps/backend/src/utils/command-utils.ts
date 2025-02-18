import { InquirerService } from "nest-commander";

export async function askConfirmation(
  inquirerService: InquirerService,
  message: string,
  options: Omit<Parameters<typeof inquirerService.inquirer.prompt>[0], "name" | "type" | "message">,
): Promise<boolean> {
  return (
    await inquirerService.inquirer.prompt<{ confirm: boolean }>({
      name: "confirm",
      type: "confirm",
      message,
      ...options,
    })
  ).confirm;
}
