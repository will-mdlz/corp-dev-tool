class DataManager {
    constructor() {
        this.data = {};
        this.metadata = {};
        //localStorage.clear();
        this.control = {};
        this.xcosts = {};
        this.proforma = {};
        this.nwc = {};
        this.dis = {}
        this.rev = {};
        this.cost = {};
        this.base = {};
        this.loadData();
        console.log(this.nwc)
    }

    loadData() {
        if(localStorage.getItem('data')) {
            this.data = JSON.parse(localStorage.getItem('data'));
            this.metadata = JSON.parse(localStorage.getItem('metadata'));
            this.control = this.filterData('control')
            this.control["Close date"] = this.convertDate(this.control["Close date"])
            this.xcosts = this.data.filter(values => values.category === 'xcost');
            this.proforma = this.data.filter(values => values.category === 'proforma');
            this.nwc = this.data.filter(values => values.category === 'nwc');
            this.dis = this.data.filter(values => values.category === 'dis');
            this.rev = this.data.filter(values => values.category === 'rev');
            this.cost = this.data.filter(values => values.category === 'cost');
            this.base = this.data.filter(values => values.category === 'base');
        }
    }

    setData(data) {
        this.data = data.values;
        localStorage.setItem('data', JSON.stringify(this.data));
        this.metadata = data.metadata;
        localStorage.setItem('metadata', JSON.stringify(this.metadata));
        this.control = this.filterData('control')
        this.xcosts = this.data.filter(values => values.category === 'xcost');
        this.proforma = this.data.filter(values => values.category === 'proforma');
        this.nwc = this.data.filter(values => values.category === 'nwc');
        this.dis = this.data.filter(values => values.category === 'dis');
        this.rev = this.data.filter(values => values.category === 'rev');
        this.cost = this.data.filter(values => values.category === 'cost');
        this.base = this.data.filter(values => values.category === 'base');
    }

    filterData(category) {
        const cat = this.data.filter(values => values.category === category);
        const vals = {}
        Object.keys(cat).forEach(key => {
            vals[cat[key].metric] = cat[key].value;
        });
        return vals;
    }

    getMetrics(category) {
        // const cat = this.data.filter(values => values.category === category);
        // const metrics = []
        
        // let priormetric = "";

        // Object.keys(cat).forEach(key => {
        //     if(!metrics.includes(cat[key].metric)) {
        //         metrics.push(cat[key].metric);
        //     }
        // });
        // return metrics;
        return this.metadata[category].metrics;
    }

    addPercentages(category) {
        const metrics = this.getMetrics(category);
        metrics.forEach((metric) => {
            
        })
    }




    convertDate(date) {
        const baseDate = new Date(1900, 0, 1)
        baseDate.setDate(baseDate.getDate() + date - 2)
        let day = baseDate.getDate()
        let month = baseDate.getMonth() + 1
        const year = baseDate.getFullYear()
        if(day < 10) {
            day = `0${day}`
        }
        if(month < 10) {
            month = `0${month}`
        }
        return `${year}-${month}-${day}`
    }
}

const db = new DataManager();

export default db;
