// Simple spinner utility
export function withSpinner(promise, message = 'Working...') {
    const spinnerChars = ['|', '/', '-', '\\'];
    let i = 0;
    process.stdout.write(message + ' ');
    const interval = setInterval(() => {
        process.stdout.write('\b' + spinnerChars[i++ % spinnerChars.length]);
    }, 100);
    return promise.finally(() => {
        clearInterval(interval);
        process.stdout.write('\b');
    });
}

export class Flags {
  constructor(flags) {
    this.flags = flags || [];
  }

    getFlagValue(flag) {
    const index = this.flags.indexOf(flag);
    if (index > -1 && index + 1 < this.flags.length) return this.flags[index + 1];
    return null;
    }

    hasFlag(flag) {
        return this.flags.includes(flag);
    }
}