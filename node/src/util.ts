import { AgentMailClient } from 'agentmail'

export const safeFunc = async <T>(
    func: (client: AgentMailClient, args: Record<string, any>) => Promise<T>,
    client: AgentMailClient,
    args: Record<string, any>
) => {
    try {
        return { isError: false, result: await func(client, args) }
    } catch (error) {
        if (error instanceof Error) return { isError: true, result: error.message }
        else return { isError: true, result: 'Unknown error' }
    }
}

/**
 * Detect file type from magic bytes (v8 worker compatible)
 * @param bytes - File bytes as Uint8Array
 * @returns MIME type string or undefined if unknown
 */
export function detectFileType(bytes: Uint8Array): string | undefined {
    if (bytes.length < 4) return undefined

    // PDF signature: %PDF (0x25 0x50 0x44 0x46)
    if (
        bytes[0] === 0x25 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x44 &&
        bytes[3] === 0x46
    ) {
        return 'application/pdf'
    }

    // ZIP signature: PK\x03\x04 (0x50 0x4B 0x03 0x04)
    // DOCX files are ZIP archives
    if (
        bytes[0] === 0x50 &&
        bytes[1] === 0x4b &&
        bytes[2] === 0x03 &&
        bytes[3] === 0x04
    ) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    return undefined
}
