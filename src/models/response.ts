function init<T>(a: T, b: T) {
    Object.assign(a, b);
}

export interface MessageData {
    id: string;
    type: string;
    created_at: string;
    visibility: string;
    url: string;
    content: string;
    account: any;
    status: any;
    reblogs_count: number;
}

export interface ResponseData {
    event?: string;
    data: MessageData;
}


export interface Response extends ResponseData {
}

export class Response {

    constructor(msg: any) {
        init<ResponseData>(this, msg);
    }

    /**
     * 反応するイベント
     * 可燃性のメッセージに反応する
     */
    isInflammable(): boolean {
        return this.event === 'update' || this.event === 'notification' && this.data.type === 'mention';
    }

    id(): string {
        if (this.event === 'notification' && this.data.type === 'mention') {
            return this.data.status.id;
        } else {
            return this.data.id;
        }
    }

    /**
     * https://example.com/@sample => @sample@example.com
     */
    username(): string {
        const url = this.data.account.url || this.data.status && this.data.status.account && this.data.status.account.url;
        const [, hostname, username] = url.match(/https:\/\/(.+)\/(@.+)/) || new Array(3);
        return `${username}@${hostname}`;
    }

    visibility(): string {
        if (this.event === 'notification' && this.data.type === 'mention') {
            return this.data.status.visibility;
        } else {
            return this.data.visibility;
        }
    }

    /**
     * 本文
     * `@ahiruyaki` に対するリプライ文字列に反応しないようにあらかじめ消しておく
     */
    content() {
        const re = /@(<span>)?ahiruyaki/g;
        const content = this.data.content || (this.data.status && this.data.status.content) || '';
        return content.replace(re, '$1');
    }

    /**
     * 生成日時
     */
    createdAt() {
        return new Date(this.data.created_at);
    }
}
