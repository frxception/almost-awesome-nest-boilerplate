// Global test setup
import 'reflect-metadata';
import path from 'path';

// Mock console.log and console.warn to reduce noise in test output
global.console.log = jest.fn();
global.console.warn = jest.fn();

// Mock import.meta for Jest environment
// @ts-ignore
globalThis.import = {
	meta: {
		dirname: path.join(__dirname, '../src'),
		url: `file://${path.join(__dirname, '../src')}`,
	},
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5kbsxgFe8xwND
lNIjm6ZZ2pBS2DUmuWmOOqdd+ZYJ3Fv/fSSRmfHW1HD3EdIPjETevkxFOAHUHnMc
jd7mY94ll1EN5zjHdrXJeiOmCEeMtFPPlUGlQ/o0I/3M437/MlRMsbm86CmmyiMe
CZRKe0ouxWPTWSOtcRF7mh/HsfDqlGRFDZV0QzHdanXs0ouMGvi3bGU3Y/2nAbD3
Y6Z8gBLTb9PEqCj4hxkH44FBtZLGEU5O1eMMG9d6FBTbq5CJWAcFW2UacqD0jJIS
Z+XUPEjOFqtdA9KrXSSFWzZkP+TPH5EU0j+72bCp5UyH3LOkyS0UdfS+QQme0TK5
GhFS4JUpAgMBAAECggEAKRtIqcMB7H3zUaWmVR/2HiJl5Qwi3gSlhs2kZJNUsrN/
J53bm2tMIKgnq/tlGm+ak/L4pz6sXQYvvqwIq+WEgLQ/zsIhGEJKK6rkObPM0bTi
efHYvFjOFH3Ci3/7kmFePi0CdX/CNkHBvLYnhMZB3RF5twggeJu64TP3hT98HCJI
7/xY5ijCNWi0OEaF+1HuYxIxwi6hhlU7etn4env+PBF4SoETauk/C53z9Zjb7DvQ
w4ThxBgqq4vY9K6fXkVLK8RZzqOLS+3xxIewvTkBwIJcnFzxBNBk5n52El/u+M9o
GAtw2Uj7V+nBltu7FjNxcdVc3W0gKrYFgctytk1RTwKBgQDxcdC4xcrywVW8ES0L
12Y93MNYsxReca6BYdXgNFa9mYwX2AvdxBcs7pOBmpm0WWwaRUyOqB1bal4dO4K6
NVSKl9wwOtmTMjw6dEuaFJtGnDj4kS5Kr8JEMpPg1o1ITD5Lcr3h39xxBUx8CJWN
cK8IvI1y/c0LqskuO48oDv52JwKBgQDEwZlNCSYyx9hstchALrvpfKcTr+vs0NDo
9YAsSTGL494sTjUnjuMpFo2FndYt6pUWADbgm12dYrsZRUOmDqpdingQQcAvOodU
fzL1oo4dQzT5qbGoOM4QTF8FDsTUc1H4zZlxUrrj18BHb406LxWyFqqONHv4PiSr
NFYY+mJ8LwKBgQDVZccYyJjrnj1sj7HEuYjAPJLbnsvt/YRDDnm+RAQ2Z7QOjwFN
7LafG+57qm0XncGSJpXXsHbiCU1NgP+2HNSv+jC+4ATVuJzK/WaktHnZGtKvv4Gu
uVF2fU1+d6M/t0OH4844CWgI7KoBJoUoEeRiUGSksfW8ziIqHrIUscvuGQKBgQCQ
O4NPj4dq7kje2BslwZyKupAXxHxkK2cZfu4oiLdDXxU80U/x4bLwKdIwwtWA71e+
uwV/fSUQ/JE/IyFGF7YXwCvnbuudM4CFFoGaw0D+fofVBOpw8MNN+04kfQEY5DiQ
9Nao1gaeg0g2lbWnk2CKHkeE20CNZ7CluEXtJY8QjQKBgB9MpYou3YsTxpJW3fmS
U+MCz3ZHAn0ErZ5jhZMUmSfpaKzi52WuEcFfW6FY+ImHbIPQSPNR/vYRghSJXmgz
sD2L8E9DeDojoZWzhlJ6v38/7pe/gbY9oAI6Cw12sRW7A886BxcUVN5zRxKY5u02
gvYWNek5Bep+EQ/EHmuhdLv3
-----END PRIVATE KEY-----`;
process.env.JWT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuZG7MYBXvMcDQ5TSI5um
WdqQUtg1JrlpjjqnXfmWCdxb/30kkZnx1tRw9xHSD4xE3r5MRTgB1B5zHI3e5mPe
JZdRDec4x3a1yXojpghHjLRTz5VBpUP6NCP9zON+/zJUTLG5vOgppsojHgmUSntK
LsVj01kjrXERe5ofx7Hw6pRkRQ2VdEMx3Wp17NKLjBr4t2xlN2P9pwGw92OmfIAS
02/TxKgo+IcZB+OBQbWSxhFOTtXjDBvXehQU26uQiVgHBVtlGnKg9IySEmfl1DxI
zharXQPSq10khVs2ZD/kzx+RFNI/u9mwqeVMh9yzpMktFHX0vkEJntEyuRoRUuCV
KQIDAQAB
-----END PUBLIC KEY-----`;
process.env.JWT_EXPIRATION_TIME = '3600';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'postgres';
process.env.DB_PASSWORD = 'postgres';
process.env.DB_DATABASE = 'nest_boilerplate';
process.env.FALLBACK_LANGUAGE = 'en';
process.env.THROTTLER_TTL = '60s';
process.env.THROTTLER_LIMIT = '10';
process.env.ENABLE_DOCUMENTATION = 'true';
process.env.NATS_ENABLED = 'false';
process.env.PORT = '3000';

// Mock path utility for cross-environment compatibility
jest.mock(
	'../src/common/utils/path.util.ts',
	() => ({
		getCurrentDirname: jest
			.fn()
			.mockReturnValue(path.join(__dirname, '../src')),
	}),
	{ virtual: true },
);

// Increase test timeout for E2E tests
jest.setTimeout(30000);
