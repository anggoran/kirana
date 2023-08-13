import gzip


def binary_encode(text: str) -> bytes:
    encoded = text.encode("utf-8")
    compressed = gzip.compress(encoded)
    return compressed


def binary_decode(binary: bytes) -> str:
    decompressed = gzip.decompress(binary)
    decoded = decompressed.decode("utf-8")
    return decoded
