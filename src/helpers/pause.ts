export async  function pause(ms: number) {
    return new Promise((res, _) => {
        setTimeout(res, ms);
    })
}