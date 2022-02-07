

const typeArray = [
        {name:'MAKE PUBLIC STATEMENT', chinese:'发表公开声明', code:'01'},
        {name:'APPEAL', chinese:'呼吁', code:'02'},
        {name:'EXPRESS INTENT TO COOPERATE', chinese:'表达合作意愿', code:'03'},
        {name:'CONSULT', chinese:'咨询', code:'04'},
        {name:'ENGAGE IN DIPLOMATIC COOPERATION', chinese:'参与外交合作', code:'05'},
        {name:'ENGAGE IN MATERIAL COOPERATION', chinese:'参与物质合作', code:'06'},
        {name:'PROVIDE AID', chinese:'提供援助', code:'07'},
        {name:'YIELD', chinese:'让步', code:'08'},
        {name:'INVESTIGATE', chinese:'调查', code:'09'},
        {name:'DEMAND', chinese:'要求', code:'10'},
        {name:'DISAPPROVE', chinese:'不赞成', code:'11'},
        {name:'REJECT', chinese:'拒绝', code:'12'},
        {name:'THREATEN', chinese:'威胁', code:'13'},
        {name:'PROTEST', chinese:'抗议', code:'14'},
        {name:'EXHIBIT FORCE POSTURE', chinese:'展示武力姿态', code:'15'},
        {name:'REDUCE RELATIONS', chinese:'降低关系', code:'16'},
        {name:'COERCE', chinese:'强制', code:'17'},
        {name:'ASSAULT', chinese:'攻击', code:'18'},
        {name:'FIGHT', chinese:'打击', code:'19'},
        {name:'USE UNCONVENTIONAL MASS VIOLENCE', chinese:'使用非常规大规律武力', code:'20'},

];
export const getChineseTypeName = (engName)=>{
        const result = typeArray.filter((item)=>item.name === engName);
        if(result.length < 1){
                return engName;
        }
        return result instanceof Array ? result[0].chinese : result.chinese;
};

export const getEngTypeName = (chineseName)=>{
        const result = typeArray.filter((item)=>item.chinese === chineseName);
        if(result.length < 1){
                return chineseName;
        }
        return result instanceof Array ? result[0].name : result.name;
};

export const getAllType = ()=>{
        return typeArray;
};
