
function TreeGenerator(parentIdString) {

    this.parentIdString = parentIdString;
    this.tree = {};
    this.layers = 0;
    this.elementsInLayer = [];

    // constants        
    this.DIV_WIDTH = 3400;
    this.DIV_TOP = 0;
    this.DIV_LEFT = 0;

    this.myHtml = {};

    this.childSpread = {
        'size': [],
        'childrenNum': null,
        'layer': null
    };

    this.createTree = function () {
        // receives string id of a parent HTML element and return JSON string of its children 
        // calls getChildrenTree recursivily for all children found 
        // add id of parent element as 'start-tree'

        // create parent structure - by cloning     
        var parentHtmlClone = document.getElementById(this.parentIdString).cloneNode(true);
        var parentName = parentHtmlClone.nodeName;

        // parsing starts here - call with parent structure
        this.tree[parentName] = this.getChildrenInTree(parentHtmlClone, {}, 0);
    }


    this.getChildrenInTree = function (htmlElement, treeNode, layerNum) {
        layerNum++;
        if (layerNum > this.layers) {
            this.layers = layerNum;
        }
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
                newHtmlElement = htmlElement.children[i];
                elementName = htmlElement.children[i].nodeName;
                // skip scripts 
                if (elementName !== 'SCRIPT') {
                    treeNode['children'][i] = {};
                    treeNode['children'][i][elementName] = this.getChildrenInTree(newHtmlElement, {}, layerNum);
                }
            }
        }
        return treeNode;
    }

    this.sumArray = function (arr) {
        var result = 0;
        for (var i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        return result;
    }

    this.countMaxChildrenSpread = function (tree, layersNum) {
//            console.log(tree);
        // start for element with many children only 
        while (tree[Object.keys(tree)[0]].children.length === 1) {
            tree = tree[Object.keys(tree)[0]].children[0];
            layersNum--;
        }
        // return variable is this.childSpread

        var treeChildren = tree[Object.keys(tree)[0]].children;
        this.childSpread['layer'] = this.layers - layersNum;

        // go for each branch 
        for (var i = 0; i < treeChildren.length; i++) {
            this.childSpread['size'][i] = 1;
            var childTree = treeChildren[i];

            // if branch has children go for layers count 
            if (typeof childTree[Object.keys(childTree)[0]].children !== 'undefined') {
                // create pool of child elements 
                var pool = [];
                for (var j = 0; j < childTree[Object.keys(childTree)[0]].children.length; j++) {
                    pool.push(childTree[Object.keys(childTree)[0]].children[j]);
                }
                // do while pool is not empty = meaning there are new layers 
                do {
                    // check max count 
                    if (pool.length > this.childSpread['size'][i]) {
                        this.childSpread['size'][i] = pool.length;
                    }
                    var poolCopy = pool.slice(0);
                    pool = [];
                    // create pool with all children elements 
                    poolCopy.forEach(function (element, index) {
                        if (typeof element[Object.keys(element)[0]].children !== 'undefined') {
                            for (var k = 0; k < element[Object.keys(element)[0]].children.length; k++) {
                                pool.push(element[Object.keys(element)[0]].children[k]);
                            }
                        }
                    })
                } while (pool.length > 0);
            }
        }
        this.childSpread['childrenNum'] = this.sumArray(this.childSpread['size']);

//            console.log(this.childSpread, Object.keys(tree)[0]);
    }


    this.processElement = function (treeObject, divTop, divLeft, divWidth, layer) {
        // gets surrouuding div values             
        // prepare current 
        var box = new TreeElement(treeObject, divTop, divLeft, divWidth);

        // draw current 
        this.myHtml.appendChild(box.divBox);

        // create children as treeObject, divTop, divLeft, divWidth and add into array 

        var left = 0;
        var leftCum = 0; // cumulate left when doing the layer 
        for (var i = 0; i < box.childrenNum; i++) {
            var width = 0;
            if (layer === this.childSpread['layer']) {
                width = (this.childSpread['size'][i] / this.childSpread['childrenNum']) * divWidth;
                left = divLeft + leftCum;
                leftCum += width;
                console.log(Object.keys(box.children[i])[0], layer, this.childSpread['size'][i], this.childSpread['childrenNum']);
            } else {
                width = divWidth / box.childrenNum;
                left = divLeft + i * width;
//                    console.log(box.children[i], layer, this.childSpread['size'][i], this.childSpread['childrenNum'], width, left);
            }
            var top = box.top;
            var o = this.createElement(box.children[i], top, left, width);
            this.elementsInLayer.push(o);
        }
    }

    this.appendToPage = function () {
        var html = document.getElementById(this.parentIdString);
        html.appendChild(this.myHtml);
    }

    this.createMyHtml = function () {
        this.myHtml = document.createElement('div');
        this.myHtml.setAttribute('style', 'position:relative;width:' + this.DIV_WIDTH + 'px; height:800px;margin:auto;background:#EEE;')

    }
    this.appendToHtml = function (element) {
        this.html.appendChild(element);
    }


    this.createElement = function (treeObject, top, left, width) {
        return {
            'treeObject': treeObject,
            'top': top,
            'left': left,
            'width': width
        }
    }

    this.main = function () {
        this.createTree();
//            console.log(JSON.stringify(this.tree));
//            console.log(this.tree);
        console.log(this.layers);
        this.countMaxChildrenSpread(this.tree, this.layers - 1);

        this.createMyHtml();
        this.appendToPage();

        var firstElement = this.createElement(this.tree, this.DIV_TOP, this.DIV_LEFT, this.DIV_WIDTH);
        this.elementsInLayer.push(firstElement);
//            console.log(this.elementsInLayer);

        for (var j = 1; j <= this.layers; j++) {
            var elementsInLayerCopy = this.elementsInLayer.slice(0);
            this.elementsInLayer = [];
//                console.log(elementsInLayerCopy);
            for (var k = 0; k < elementsInLayerCopy.length; k++) {
                var o = elementsInLayerCopy[k];
                this.processElement(o.treeObject, o.top, o.left, o.width, j);
            }
        }

    }

    this.main();

}






