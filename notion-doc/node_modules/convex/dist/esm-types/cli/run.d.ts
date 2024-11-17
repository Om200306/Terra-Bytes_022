import { Command } from "@commander-js/extra-typings";
export declare const run: Command<[string, string | undefined], {
    watch?: true | undefined;
    push?: boolean | undefined;
    url?: string | undefined;
    adminKey?: string | undefined;
    prod?: boolean | undefined;
    previewName?: string | undefined;
    deploymentName?: string | undefined;
    typecheck: "enable" | "try" | "disable";
    typecheckComponents: boolean;
    codegen: "enable" | "disable";
    component?: string | undefined;
    liveComponentSources?: true | undefined;
}>;
//# sourceMappingURL=run.d.ts.map