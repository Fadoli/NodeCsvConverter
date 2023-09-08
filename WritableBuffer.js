const defaultAllocatedSize = 1024 * 1024;

class writableBuffer {
    constructor(preallocated = defaultAllocatedSize) {
        this.internalBuffer = Buffer.allocUnsafe(preallocated);
        this.index = 0;
        this.remaining = preallocated;
    }

    reallocateBuffer() {
        const bufferSwap = this.internalBuffer;
        this.internalBuffer = Buffer.allocUnsafe(this.internalBuffer.byteLength * 4);
        bufferSwap.copy(this.internalBuffer, 0, 0, this.index);
    }

    /**
     * Write to the internal Buffer
     * @param {string} stuff
     * @memberof writableBuffer
     */
    writeStr(stuff) {
        const length = stuff.length;
        if (this.remaining <= length) {
            this.reallocateBuffer();
        }
        this.internalBuffer.write(stuff, this.index);
        this.index += length;
        this.remaining -= length;
    }
    /**
     * Write to the internal Buffer
     * @param {Number} stuff
     * @memberof writableBuffer
     */
    writeInt8(stuff) {
        if (!this.remaining) {
            this.reallocateBuffer();
        }
        this.internalBuffer.writeInt8(stuff);
        this.index++;
        this.remaining--;
    }

    remove(byteLength) {
        this.index -= byteLength;
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
