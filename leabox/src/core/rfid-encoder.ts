import { utf8ByteArrayToString, stringToUtf8ByteArray } from 'utf8-string-bytes';

export class RfidEncoder {

    static encodeId(id: string): number[] {
        const template = [
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
        ];

        const encodedId = stringToUtf8ByteArray(id);

        template[0] = encodedId.length;

        for (let i = 1; i < encodedId.length + 1; i++) {
            template[i] = encodedId[i - 1];
        }

        return template;
    }

    static decodeId(content: number[]): string {
        const lengthOfPayload = content[0];
        const payload = content.slice(1, lengthOfPayload + 1);
        return utf8ByteArrayToString(payload);
    }

}