export class InseeCodeToCounty {
  static ConvertToCounty(inseeCode: string): string {
    const department = inseeCode.substring(0, 2);
    if (Number(department) > 95) {
      return inseeCode.substring(0, 3);
    }
    return department;
  }
}
