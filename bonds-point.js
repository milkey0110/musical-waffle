let allClassO = ["セイバー", "アーチャー", "ランサー", "ライダー", "キャスター", "アサシン", "バーサーカー", "その他"];
let allRarity = ["0", "1", "2", "3", "4", "5"];
let conditionCr = "cr";
let conditionName = "name";
let conditionCheck = "check";

var app = new Vue({
	el: "#app-bonds-point",
	data: {
		servantList: [],

		// 絞り込み条件：名前
		inputNameArray: [],

		// 絞り込み条件：チェックボックス
		checkedClassO: allClassO,
		checkedRarity: allRarity,
		checkedAllClassO: true,
		checkedAllRarity: true,

		// 有効な絞り込み条件
		condition: "cr",

		visibleLv10: false,
		widthDevided: 100
	},
	computed: {
		filterServantList: function() {
			if (this.condition === conditionName) {
				return this.servantList.filter(this.filterByName);
			} else if (this.condition === conditionCheck) {
				return this.servantList.filter(this.filterByCheck);
			}
			return this.servantList
				.filter(this.filterByRarity)
				.filter(this.filterByClassO);
		},
		isConditionCr: function() {
			if (this.condition === conditionCr) {
				return true;
			}
			return false;
		},
		isConditionName: function() {
			if (this.condition === conditionName) {
				return true;
			}
			return false;
		},
		isConditionCheck: function() {
			if (this.condition === conditionCheck) {
				return true;
			}
			return false;
		}
	},
	methods: {
		calcWidth: function(point) {
			return point / app.widthDevided;
		},
		getClassO: function(cls) {
			if (cls === "セイバー" || cls === "アーチャー" || cls === "ランサー"
				|| cls === "ライダー" || cls === "キャスター" || cls === "アサシン" || cls === "バーサーカー") {
			   return cls;
			}
			return "その他";
		},
		// 名前の「〔」以降の文字列を削除
		getSimpleName: function(servantName) {
			if (servantName.indexOf("〔") >= 0) {
				return servantName.substring(0, servantName.indexOf("〔"));
			}
			return servantName;
		},
		refineName: function() {
			let inputNameStr = document.getElementById("js-input-name").value;
			if (!inputNameStr) {
				app.inputNameArray = [];
				return;
			}
			app.inputNameArray = inputNameStr.replace(/\s+/g, "").split(",");
		},
		filterByClassO: function(servant) {
			if ((app.checkedClassO).indexOf(app.getClassO(servant.class)) >= 0){
				return true;
			}
			return false;
		},
		filterByRarity: function(servant) {
			if ((app.checkedRarity).indexOf(String(servant.rarity)) >= 0){
				return true;
			}
			return false;
		},
		filterByName: function(servant) {
			if (app.inputNameArray.length === 0) {
				return true;
			}

			for(let i = 0; i < app.inputNameArray.length; i++) {
				if (app.getSimpleName(servant.name).indexOf(app.inputNameArray[i]) >= 0) {
					return true;
				}
			}
			return false;
		},
		filterByCheck: function(servant) {
			return servant.checked;
		},
		displayAllClass: function() {
			app.checkedClassO = allClassO;
		},
		hiddenAllClass: function() {
			app.checkedClassO = [];
		},
		displayAllRarity: function() {
			app.checkedRarity = allRarity;
		},
		hiddenAllRarity: function() {
			app.checkedRarity = [];
		}
	},
	watch: {
		// 全クラスチェックボックス変更イベント
		checkedAllClassO: function(newVal, oldVal) {
			if (newVal) {
				app.displayAllClass();
				return;
			}
			app.hiddenAllClass();
		},
		// 全レアリティチェックボックス変更イベント
		checkedAllRarity: function(newVal, oldVal) {
			if (newVal) {
				app.displayAllRarity();
				return;
			}
			app.hiddenAllRarity();
		},
		visibleLv10: function(newVal, oldVal) {
			if (newVal) {
				app.widthDevided = 3500;
				return;
			}
			app.widthDevided = 100;
		}
	},
	beforeCreate: function() {
		// 絆ポイントデータ取得
		axios.get("./bonds-point.json")
		.then(function (response) {
			console.log(response);
			app.servantList = response.data.servantList
		})
		.catch(function (error) {
			console.log(error);
		});
	}
});

