const defaultAllocatedSize = 1024 * 1024;

class writableBuffer {
    constructor(preallocated = defaultAllocatedSize) {
        this.internalBuffer = Buffer.allocUnsafe(preallocated);
        this.index = 0;
    }

    /**
     * Write to the internal Buffer
     * @param {string} stuff
     * @memberof writableBuffer
     */
    write(stuff) {
        const written = this.internalBuffer.write(stuff, this.index);
        if (written !== stuff.length) {
            const bufferSwap = this.internalBuffer;
            this.internalBuffer = Buffer.allocUnsafe(this.internalBuffer.byteLength * 4);
            bufferSwap.copy(this.internalBuffer, 0, 0, this.index);
            this.internalBuffer.write(stuff, this.index);
        }
        this.index += stuff.length;
    }

    /**
     * Return the Buffer
     * @memberof writableBuffer
     */
    render() {
        return this.internalBuffer.subarray(0, this.index);
    }
}

module.exports = writableBuffer;
