type VERSIONS = "v2.0.0"

export function deprecated(
    thing: string,
    version: VERSIONS,
    opts?: { aggressive?: boolean; replacement?: string }
): void {
    let notice = `LZString | ${thing} is deprecated as of: ${version}`
    if (opts?.replacement) {
        notice += ` - Please use ${opts.replacement} instead`
    }
    console.error(notice)
    if (window && opts?.aggressive) alert(notice)
}
