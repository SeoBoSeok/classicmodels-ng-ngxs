/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class ChartUtils {

    constructor() {}

    /**
    * @param xLabel
    * @param map	y value to x and series(=z)
    * @param series	array of series
    * @param labels	array of label
    * @return array of array to draw chart.
    *	datas[0][0] => title to x-axis
    *	datas[x][0] => label to x-axis
    *	datas[0][z] => label to series(each line or bar)
    *	datas[x+1][z+1] => data to x and series(=z)
    */
    static googleChartDatasTo(xLabel: string, map: any, 
                    series: Array<string>, labels: Array<string>): Array<any> {
        // map => map[x][z] => y
        let datas: Array<any> = new Array(labels.length + 1);
        let xmap: any;
        let x, z: number;

        datas[0] = new Array(series.length + 1);
        datas[0].fill(null);
        datas[0][0] = xLabel;
//console.log("series.length = "+series.length);
        for (z=0 ; z<series.length ; z++) {
            datas[0][z+1] = series[z];
        }
        labels.sort();
//console.log("labels.length = "+labels.length);
        for (x=0 ; x<labels.length ; x++) {
            datas[x+1] = new Array<any>(series.length + 1);
            datas[x+1].fill(null);
            datas[x+1][0] = labels[x];
        }

        // z is series.
        for (x=0 ; x<labels.length ; x++) {
            xmap = map[labels[x]]
            if (!xmap) {
                continue;
            }
            for (z=0 ; z<series.length ; z++) {
                if (xmap.hasOwnProperty(series[z])) {
                    datas[x+1][z+1] = xmap[series[z]];
                }
            }
        }

        return datas;
    }

    /**
    * @param map	y value to x and series(=z)
    * @param series	array of series
    * @param labels	array of label
    * @return array of hash to draw chart.
    *	datas[i] => {data: [v1, v2, ...], label: 'label1'},
    */
    static ng2ChartsDatasTo(map: any, series: Array<string>, labels: Array<string>): Array<any> {
        // map => map[x][z] => y
        let datas: Array<any> = new Array(series.length);
        let xmap: any;
        let x, z: number;

        datas.fill({data:[]});
//console.log("series.length = "+series.length);
        for (z=0 ; z<series.length ; z++) {
            datas[z] = {data:new Array(labels.length), label: series[z]};
            datas[z].data.fill(null);
        }
//console.log("labels.length = "+labels.length);

        // z is series.
        for (x=0 ; x<labels.length ; x++) {
            xmap = map[labels[x]]
            if (!xmap) {
                continue;
            }
            for (z=0 ; z<series.length ; z++) {
                if (xmap.hasOwnProperty(series[z])) {
                    datas[z].data[x] = xmap[series[z]];
                }
            }
        }

        return datas;
    }

    // copy from ng2-charts.js
    static rgba(colour:Array<number>, alpha:number):string {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
    }

    static getRandomInt(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomColor():number[] {
        return [
            ChartUtils.getRandomInt(0, 255), 
            ChartUtils.getRandomInt(0, 255), 
            ChartUtils.getRandomInt(0, 255)
        ];
    }

    static randomColors(colors: number[]): any {
        return {
            backgroundColor: ChartUtils.rgba(colors, 0.4),
            borderColor: ChartUtils.rgba(colors, 1),
            pointBackgroundColor: ChartUtils.rgba(colors, 1),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: ChartUtils.rgba(colors, 0.8)
        };
    }

    static applyColors(datas: Array<any>, colors: Array<any>): Array<any> {
        let colorValues: any;
        return datas.map((item, i) => {
            if (i < colors.length) {
                colorValues = colors[i];
            } else {
                colorValues = ChartUtils.randomColors(ChartUtils.getRandomColor());
            }
            Object.assign(item, colorValues);
            return item;
        })
    }

}
