export const enum TableKeyType {
  PRIMARY_KEY = 'PRIMARY KEY',
  UNIQUE_KEY = 'UNIQUE KEY',
  FOREIGN_KEY = 'FOREIGN KEY',
  INDEX_KEY = 'KEY'
}

export const KeyType: {[index: string]: TableKeyType} = {
  'PRIMARY KEY': TableKeyType.PRIMARY_KEY,
  'UNIQUE': TableKeyType.UNIQUE_KEY,
  'FOREIGN KEY': TableKeyType.FOREIGN_KEY,
  'KEY': TableKeyType.INDEX_KEY
}
