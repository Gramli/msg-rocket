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

    getArrayArgs(flag) {
      const value = this.getFlagValue(flag);
      if (!value) return [];
      return value.split(/[, ]+/).map(t => t.trim()).filter(Boolean);
    }
}