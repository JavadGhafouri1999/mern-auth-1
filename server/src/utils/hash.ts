import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRound?: number) => bcrypt.hash(value, saltRound || 10);

export const compareValues = async (value: string, hashedValue: string) =>
	bcrypt.compare(value, hashedValue).catch(() => false);
// That last part .catch(() => false) does a simple thing it catches all errors from here
// and make them false cause who cares?
