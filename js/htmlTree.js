
document.addEventListener('DOMContentLoaded', function () {

    function TreeGenerator(parentIdString) {
        
        this.parentIdString = parentIdString;
        this.tree = {};     
        this.layers = 0;
        this.elementsInLayer = [];
        
        // constants        
        this.DIV_WIDTH = 2400;        
        this.DIV_TOP = 0;
        this.DIV_LEFT = 0;

        this.myHtml = {};   
        
        this.createTree = function() {
            // receives string id of a parent HTML element and return JSON string of its children 
            // calls getChildrenTree recursivily for all children found 
            // add id of parent element as 'start-tree'

            // create parent structure - by cloning     
            var parentHtmlClone = document.getElementById(this.parentIdString).cloneNode(true);
            var parentName = parentHtmlClone.nodeName;

            // parsing starts here - call with parent structure
            this.tree[parentName] = this.getChildrenInTree(parentHtmlClone, {});                  
            }
        
        
        this.getChildrenInTree = function(htmlElement, treeNode) {
            
            // id 
            if (htmlElement.id.length) {
                treeNode['id'] = htmlElement.id;
            }
            // class
            if (htmlElement.classList.length) {
                treeNode['classList'] = [];
                for (var i = 0; i < htmlElement.classList.length; i++) {
                    treeNode['classList'][i] = htmlElement.classList[i];
                }
            }
            // children
            if (htmlElement.children.length) {
                treeNode['children'] = [];
                for (var i = 0; i < htmlElement.children.length; i++) {
                    if (i ===0) {
                        this.layers++;
                    }
                    newHtmlElement = htmlElement.children[i];
                    elementName = htmlElement.children[i].nodeName;
                    treeNode['children'][i] = {};
                    treeNode['children'][i][elementName] = this.getChildrenInTree(newHtmlElement, {});
                }
            }
            return treeNode;
        }            
        
        
        this.processElement = function(treeObject, divTop, divLeft, divWidth) {
            // gets surrouuding div values             
            // prepare current 
            var box = new TreeElement(treeObject, divTop, divLeft, divWidth); 

            // draw current 
            this.myHtml.appendChild(box.divBox);                

            // create children as treeObject, divTop, divLeft, divWidth and add into array 
            
            for (var i = 0; i < box.childrenNum; i++) {
                var width = divWidth / box.childrenNum;
                var top = box.top;
                var left = divLeft + i * width;
                var o = this.createElement(box.children[i], top, left, width);
                this.elementsInLayer.push(o);                
            }
//            console.log(treeObject);
//            console.log(box.childrenNum);
//            console.log(box.children);
//              console.log(this.elementsInLayer);
        }

        this.appendToPage = function() {
            var html = document.getElementById(this.parentIdString);
            html.appendChild(this.myHtml);            
        }
        
        this.createMyHtml = function() {
            this.myHtml = document.createElement('div');  
            this.myHtml.setAttribute('style', 'position:relative;width:'+this.DIV_WIDTH+'px; height:800px;margin:auto;background:#EEE;')
            
        }
        this.appendToHtml = function(element) {
            this.html.appendChild(element);
        }
        
        
        this.createElement = function(treeObject, top, left, width) {
            return {
                'treeObject': treeObject,
                'top': top,
                'left': left,
                'width': width
            }            
        }
        
        this.main = function() {
            this.createTree();
            console.log(JSON.stringify(this.tree));
            console.log(this.tree);
            console.log(this.layers);
            
            this.createMyHtml();
            this.appendToPage();
            
            var firstElement = this.createElement(this.tree, this.DIV_TOP, this.DIV_LEFT, this.DIV_WIDTH);
            this.elementsInLayer.push(firstElement);
//            console.log(this.elementsInLayer);
            
            for (var j = 0; j < this.layers; j++) {
                var elementsInLayerCopy = this.elementsInLayer.slice(0);
                this.elementsInLayer = [];
                console.log(elementsInLayerCopy);
                for (var k = 0; k < elementsInLayerCopy.length; k++) {
                    var o = elementsInLayerCopy[k];
                    this.processElement(o.treeObject, o.top, o.left, o.width);                    
                }                
            }
            
        }
                   
        this.main();
            
    }
    
    
    function TreeElement(treeObject, divTop, divLeft, divWidth) {
        this.BOX_WIDTH = 60;
        this.BOX_HEIGHT = 20;
        
        this.divTop = divTop;
        this.divLeft = divLeft;
        this.divWidth = divWidth;

        this.self = treeObject;
        this.name = Object.keys(treeObject)[0];        
        this.top = this.divTop + this.BOX_HEIGHT * 2;
        this.left = this.divLeft + (this.divWidth - this.BOX_WIDTH)/ 2;      
        
        this.childrenNum = 0;
        this.children = [];
        

        this.divBoxAttrs = {
            height: this.BOX_HEIGHT + 'px',
            width: this.BOX_WIDTH + 'px',
            position: 'absolute',
            background: '#CCC',
            top: this.top + 'px',
            left: this.left + 'px',
            margin: 'auto',
            padding: '5px 2px'            
        }    
        
        this.divBox = document.createElement('div');        

        this.setChildren = function() {
            if (typeof this.self[this.name].children !== 'undefined') {
                this.childrenNum = this.self[this.name].children.length;
                this.children = this.self[this.name].children;                                
            }            
        }

        this.createStyleAttr = function(attrs) {
            var result = '';
            for (var key in attrs) {
                result += key + ':' + attrs[key] + ';';
            }
            return result;
        }            
        
        this.createAttrs = function() {
            this.divBoxAttrs['text-align'] = 'center';            
            this.divBox.setAttribute('style', this.createStyleAttr(this.divBoxAttrs));            
        }        
        
        this.main = function() {
            this.divBox.textContent = this.name; 
            this.createAttrs();  
            this.setChildren();
        }
        
        this.main();
    }
    
        
    // program starts here 
    var parentIdString = 'start-tree';    
    // run class
    var app = new TreeGenerator(parentIdString);
 
});
    
    
    
  

