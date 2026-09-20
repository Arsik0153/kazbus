import { isIP } from 'node:net';

export function clientIpHeaders(
    ingressIp: string | null,
    trustIngress: boolean
): Record<string, string> {
    if (!trustIngress || !ingressIp || !isIP(ingressIp)) return {};
    return { 'X-Forwarded-For': ingressIp };
}
