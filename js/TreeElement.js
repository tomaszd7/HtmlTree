
function TreeElement(treeObject, divTop, divLeft, divWidth) {
    this.BOX_WIDTH = 90;
    this.BOX_HEIGHT = 20;
    this.BOX_MARGIN = 70;

    this.divTop = divTop;
    this.divLeft = divLeft;
    this.divWidth = divWidth;

    this.self = treeObject;
    this.name = Object.keys(treeObject)[0];
    this.top = this.divTop + this.BOX_HEIGHT + this.BOX_MARGIN;
    this.left = this.divLeft + (this.divWidth - this.BOX_WIDTH) / 2;

    this.childrenNum = 0;
    this.children = [];


    this.divBoxAttrs = {
//        height: this.BOX_HEIGHT + 'px',
        width: this.BOX_WIDTH + 'px',
        position: 'absolute',
        background: '#CCC',
        top: this.top + 'px',
        left: this.left + 'px',
        margin: 'auto',
        padding: '5px 2px'
    }

    this.divBox = null;

    this.setChildren = function () {
        if (typeof this.self[this.name].children !== 'undefined') {
            this.childrenNum = this.self[this.name].children.length;
            this.children = this.self[this.name].children;
        }
    }

    this.createStyleAttr = function (attrs) {
        var result = '';
        for (var key in attrs) {
            result += key + ':' + attrs[key] + ';';
        }
        return result;
    }
    
    this.createClassString = function () {
        if (typeof this.self[Object.keys(this.self)[0]].classList !== 'undefined') {
            var res = '';
            for (var i = 0; i < this.self[Object.keys(this.self)[0]].classList.length; i++) {
                res += this.self[Object.keys(this.self)[0]].classList[i] + '<br/>';
            }
            return res;            
        } else {
            return false;
        }            
    }
    
    this.createIdString = function () {
        if (typeof this.self[Object.keys(this.self)[0]].id !== 'undefined') {            
            return this.self[Object.keys(this.self)[0]].id;            
        } else {
            return false;
        }           
    }
    
    this.createDivBox = function() {
//        console.log(this.self);
        this.divBox = document.createElement('div');
        this.divBox.innerHTML = '<p class="names">'+this.name+'</p>';
        if (id = this.createIdString()) {
            this.divBox.innerHTML += '<p class="ids">'+ id + '</p>' ;
        }
        if (classString = this.createClassString()) {
            this.divBox.innerHTML += '<p class="classes">'+ classString + '</p>' ;
        }

            
    }

    this.createAttrs = function () {
        this.divBoxAttrs['text-align'] = 'center';
        this.divBox.setAttribute('style', this.createStyleAttr(this.divBoxAttrs));
    }

    this.main = function () {
        this.createDivBox();
        this.createAttrs();
        this.setChildren();
    }

    this.main();
}
