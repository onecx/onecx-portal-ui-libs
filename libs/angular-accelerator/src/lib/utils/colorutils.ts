export class ColorUtils {
  public static calculatePoint(
    i: number,
    intervalSize: number,
    colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
  ): any {
    const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
    return useEndAsStart ? colorEnd - i * intervalSize : colorStart + i * intervalSize
  }

  public static interpolateColors(
    dataLength: number,
    colorScale: (arg0: any) => any,
    colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
  ): any {
    const { colorStart, colorEnd } = colorRangeInfo
    const colorRange = colorEnd - colorStart
    const intervalSize = colorRange / dataLength
    let i, colorPoint
    const colorArray = []

    for (i = 0; i < dataLength; i++) {
      colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo)
      colorArray.push(colorScale(colorPoint))
    }

    return colorArray
  }
}
