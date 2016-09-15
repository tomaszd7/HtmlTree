
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
            result += arr[i]['number'];
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
            this.childSpread['size'][i] = {};
            this.childSpread['size'][i]['number'] = 1;
            var childTree = treeChildren[i];
            this.childSpread['size'][i]['name'] = Object.keys(childTree)[0];
            
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
                    if (pool.length > this.childSpread['size'][i]['number']) {
                        this.childSpread['size'][i]['number'] = pool.length;
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
                width = (this.childSpread['size'][i]['number'] / this.childSpread['childrenNum']) * divWidth;
                left = divLeft + leftCum;
                leftCum += width;
//                console.log(Object.keys(box.children[i])[0], layer, this.childSpread['size'][i], this.childSpread['childrenNum']);
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

    this.appendToPage = function (child) {
        var html = document.getElementById(this.parentIdString);
        html.appendChild(child);
    }

    this.createMyHtml = function () {
        this.myHtml = document.createElement('div');
        this.myHtml.id = 'tree';
        this.myHtml.setAttribute('style', 'position:relative;width:' + this.DIV_WIDTH + 'px; height:800px;margin:auto;background:#EEE;')

    }
    
    this.createStatsHtml = function () {
        var div = document.createElement('div');
        div.id = 'stats';
        // layers / spread - curr layer / childnum , layers: name / count 
        var p = document.createElement('p');
        p.innerHTML = 'Layers: ' + this.layers + '   ';
        p.innerHTML += 'Spread layer: ' + this.childSpread.layer + '   ';
        p.innerHTML += 'Spread max: ' + this.childSpread.childrenNum + '   ';
        p.innerHTML += 'Spreads: ';
        
        for (var i = 0; i < this.childSpread.size.length; i++) {
            p.innerHTML += this.childSpread.size[i]['name'] + ': ' + this.childSpread.size[i]['number'] + ', ';
        }
        div.appendChild(p);     
        return div;
    }
    
    this.createSearchLine = function () {
        var div = document.createElement('div');
        div.id = 'searchLine';
        // input 
        var inp = document.createElement('input');
        inp.id = 'searchBox'
        inp.setAttribute('type', 'text');
        inp.setAttribute('size', '100');
        div.appendChild(inp);
        // run button 
        var but = document.createElement('input');
        but.setAttribute('type', 'submit');
        but.addEventListener('click', function (event) {
            console.log('clicked');
            var searchBox = document.getElementById('searchBox');
            console.log(searchBox.value);
            $.ajax({ url: 'http://tomaszd7.github.io/statkiGraficznie/index.html', 
                success: function(response) { 
                    console.log(response);
//                    var parser = new DOMParser();
//                    var dom = parser.parseFromString(response, "text/xml");
                    var dom = document.createElement('div');
                    
                    dom.innerHTML = response;
                    console.log(dom);
                    var body = dom.getElementsByTagName('body');
                    console.log(body[0]);
                } });
//            $.get('tomaszd7.github.io', function(response) {
//                console.log(response);
//            })
            searchBox.value = '';
            event.preventDefault();
        });
        div.appendChild(but);
        return div;
        
    }
    
    this.appendToHtml = function (element) {
        this.html.appendChild(element);
    }

    this.hideCurrentPage = function () {
        var html = document.getElementById(this.parentIdString);
        for (var i = 0; i < html.children.length; i++) {
            html.children[i].setAttribute('style', 'display:none;');
        }        
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
//        console.log(this.layers);
        this.countMaxChildrenSpread(this.tree, this.layers - 1);
        
        this.hideCurrentPage();

        this.createMyHtml();
        // add search  on page 
        this.appendToPage(this.createSearchLine());
        // add stats on page 
        this.appendToPage(this.createStatsHtml());
        // add main div box 
        this.appendToPage(this.myHtml);
        

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






