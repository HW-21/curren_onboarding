export class CacheHelper<CacheObject> {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  private getFileName() {
    return `.cache/cypress-cache-${this.key}.json`
  }

  load() {
    return cy.readFile(this.getFileName()).then((result) => {
      return result as CacheObject
    })
  }

  write(obj: CacheObject) {
    return cy.writeFile(this.getFileName(), obj)
  }
}
