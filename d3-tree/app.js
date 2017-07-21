angular.module('app', ['d3'])
    .controller('myCtrl', function($scope, d3Service,$http) {
        $http({
          method:"GET",
          url:"flare.json"
        }).then(function(res){
          $scope.d3Data=res.data
        })
        $scope.user={}
      })
    .directive("d3Tree",function(d3Service){
      return{
        restrict:"EA",
        scope:{
          data:'=',
          user:'='

          
        },
        link:function($scope,ele,attrs){
        d3Service.d3().then(function(d3) {
            // treeJSON = d3.json("flare.json", function(error, treeData) {

                // Calculate total nodes, max label length
                var totalNodes = 0;
                var maxLabelLength = 0;
                // variables for drag/drop
                var selectedNode = null;
                var draggingNode = null;
                // panning variables
                var panSpeed = 200;
                var panBoundary = 20; // Within 20px from edges will pan when dragging.
                // Misc. variables
                var i = 0;
                var duration = 750,
                    rectW = 120,
                    rectH = 100;
                var root;

                // size of the diagram
                var viewerWidth = $(document).width();
                var viewerHeight = $(document).height();
                var menu = [
                    {
                      title: 'Vacate Position',
                      action: function(elm, d, i) {
                        vacate(d)
                      }
                    },
                    {
                      title: 'Remove Role',
                      action: function(elm, d, i) {
                        removeRole(d)
                      }
                    },
                    {
                      title: 'Remove Department',
                      action: function(elm, d, i) {
                        removeDepartment(d)
                      }
                    },
                    {
                      title: 'Add Role',
                      action: function(elm, d, i) {
                        addRole(d)
                      }
                    }
                    ]
                d3.contextMenu = function (menu, openCallback) {
                      d3.selectAll('.d3-context-menu').data([1])
                        .enter()
                        .append('div')
                        .attr('class', 'd3-context-menu');
                      // close menu
                      d3.select('body').on('click.d3-context-menu', function() {
                        d3.select('.d3-context-menu').style('display', 'none');
                      });
                      // this gets executed when a contextmenu event occurs
                      return function(data, index) {  
                        var elm = this;
                        d3.selectAll('.d3-context-menu').html('');
                        var list = d3.selectAll('.d3-context-menu').append('ul');
                        list.selectAll('li').data(menu).enter()
                          .append('li')
                          .html(function(d) {
                            return d.title;
                          })
                          .on('click', function(d, i) {
                            d.action(elm, data, index);
                            d3.select('.d3-context-menu').style('display', 'none');
                          });
                        // the openCallback allows an action to fire before the menu is displayed
                        // an example usage would be closing a tooltip
                        if (openCallback) openCallback(data, index);
                        // display context menu
                        d3.select('.d3-context-menu')
                          .style('left', (d3.event.pageX - 2) + 'px')
                          .style('top', (d3.event.pageY - 2) + 'px')
                          .style('display', 'block');
                        d3.event.preventDefault();
                      };
                    };
                var tree = d3.layout.tree()
                    // .size([viewerHeight, viewerWidth]);

                // define a d3 diagonal projection for use by the node paths later on.
                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.x + rectW / 2, d.y + rectH / 2];
                    });
                var colorScale = d3.scale.linear()
                    .domain([1, 3, 5])
                    .range(['#CF5C60', '#F3AE4E', '#4AB471']);
                var strokeScale = d3.scale.linear()
                    .domain([1, 5])
                    .range([2, 9]);

                function removeDepartment(d){
                  var children=[];
                  d.parent.children.forEach(function(child){
                    if(child.id!=d.id){
                      children.push(child)
                    }
                  })
                  d.parent.children=children;
                  update(d.parent)
                }
                function removeRole(d){
                  var children=d.children||d._children||[];
                  d.parent.children.forEach(function(child){
                    if(child.id!=d.id){
                      children.push(child)
                    }
                  })
                  d.parent.children=children;
                  update(d.parent)

                }
                function vacate(d){
                  d.name="Vacant";
                  update(d)
                }
                function addRole(d){
                  console.log(d)
                  var nodes=tree(root);
                  var n={id:nodes.length,name:'randomname'}
                  if (d.children) d.children.push(n); else d.children = [n];
                  // nodes.push(n)
                  // update(d)
                }

                // A recursive helper function for performing some setup by walking through all nodes
                function visit(parent, visitFn, childrenFn) {
                    if (!parent) return;

                    visitFn(parent);

                    var children = childrenFn(parent);
                    if (children) {
                        var count = children.length;
                        for (var i = 0; i < count; i++) {
                            visit(children[i], visitFn, childrenFn);
                        }
                    }
                }

                // Call visit function to establish maxLabelLength. treeData
                visit($scope.data, function(d) {
                    totalNodes++;
                    maxLabelLength = Math.max(d.name.length, maxLabelLength);

                }, function(d) {
                    return d.children && d.children.length > 0 ? d.children : null;
                });


                // sort the tree according to the node names

                function sortTree() {
                    tree.sort(function(a, b) {
                        return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
                    });
                }
                // Sort the tree initially incase the JSON isn't in a sorted order.
                sortTree();

                // TODO: Pan function, can be better implemented.

                function pan(domNode, direction) {
                    var speed = panSpeed;
                    if (panTimer) {
                        clearTimeout(panTimer);
                        translateCoords = d3.transform(svgGroup.attr("transform"));
                        if (direction == 'left' || direction == 'right') {
                            translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                            translateY = translateCoords.translate[1];
                        } else if (direction == 'up' || direction == 'down') {
                            translateX = translateCoords.translate[0];
                            translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                        }
                        scaleX = translateCoords.scale[0];
                        scaleY = translateCoords.scale[1];
                        scale = zoomListener.scale();
                        svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                        d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                        zoomListener.scale(zoomListener.scale());
                        zoomListener.translate([translateX, translateY]);
                        panTimer = setTimeout(function() {
                            pan(domNode, speed, direction);
                        }, 50);
                    }
                }

                // Define the zoom function for the zoomable tree

                function zoom() {
                    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }


                // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
                var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

                function initiateDrag(d, domNode) {
                    draggingNode = d;
                    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
                    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
                    d3.select(domNode).attr('class', 'node activeDrag');

                    svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
                        if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                        else return -1; // a is the hovered element, bring "a" to the front
                    });
                    // if nodes has children, remove the links and nodes
                    if (nodes.length > 1) {
                        // remove link paths
                        links = tree.links(nodes);
                        nodePaths = svgGroup.selectAll("path.link")
                            .data(links, function(d) {
                                return d.target.id;
                            }).remove();
                        // remove child nodes
                        nodesExit = svgGroup.selectAll("g.node")
                            .data(nodes, function(d) {
                                return d.id;
                            }).filter(function(d, i) {
                                if (d.id == draggingNode.id) {
                                    return false;
                                }
                                return true;
                            }).remove();
                    }

                    // remove parent link
                    parentLink = tree.links(tree.nodes(draggingNode.parent));
                    svgGroup.selectAll('path.link').filter(function(d, i) {
                        if (d.target.id == draggingNode.id) {
                            return true;
                        }
                        return false;
                    }).remove();

                    dragStarted = null;
                }

                // define the baseSvg, attaching a class for styling and the zoomListener
                var baseSvg = d3.select(ele[0]).append("svg")
                    .attr("width", viewerWidth)
                    .attr("height", viewerHeight)
                    .attr("class", "overlay")
                    .call(zoomListener);


                // Define the drag listeners for drag/drop behaviour of nodes.
                dragListener = d3.behavior.drag()
                    .on("dragstart", function(d) {
                        if (d == root) {
                            return;
                        }
                        dragStarted = true;
                        nodes = tree.nodes(d);
                        d3.event.sourceEvent.stopPropagation();
                        // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                    })
                    .on("drag", function(d) {
                        if (d == root) {
                            return;
                        }
                        if (dragStarted) {
                            domNode = this;
                            initiateDrag(d, domNode);
                        }

                        // get coords of mouseEvent relative to svg container to allow for panning
                        relCoords = d3.mouse($('svg').get(0));
                        if (relCoords[0] < panBoundary) {
                            panTimer = true;
                            pan(this, 'left');
                        } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                            panTimer = true;
                            pan(this, 'right');
                        } else if (relCoords[1] < panBoundary) {
                            panTimer = true;
                            pan(this, 'up');
                        } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                            panTimer = true;
                            pan(this, 'down');
                        } else {
                            try {
                                clearTimeout(panTimer);
                            } catch (e) {

                            }
                        }

                        d.x0 += d3.event.dx;
                        d.y0 += d3.event.dy;
                        var node = d3.select(this);
                        node.attr("transform", "translate(" + d.x0 + "," + d.y0 + ")");
                        updateTempConnector();
                    }).on("dragend", function(d) {
                        if (d == root) {
                            return;
                        }
                        domNode = this;
                        if (selectedNode) {
                            // now remove the element from the parent, and insert it into the new elements children
                            var index = draggingNode.parent.children.indexOf(draggingNode);
                            if (index > -1) {
                                draggingNode.parent.children.splice(index, 1);
                            }
                            if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                                if (typeof selectedNode.children !== 'undefined') {
                                    selectedNode.children.push(draggingNode);
                                } else {
                                    selectedNode._children.push(draggingNode);
                                }
                            } else {
                                selectedNode.children = [];
                                selectedNode.children.push(draggingNode);
                            }
                            // Make sure that the node being added to is expanded so user can see added node is correctly moved
                            expand(selectedNode);
                            sortTree();
                            endDrag();
                        } else {
                            endDrag();
                        }
                    });

                function endDrag() {
                    selectedNode = null;
                    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
                    d3.select(domNode).attr('class', 'node');
                    // now restore the mouseover event or we won't be able to drag a 2nd time
                    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
                    updateTempConnector();
                    if (draggingNode !== null) {
                        update(root);
                        // centerNode(draggingNode);
                        draggingNode = null;
                    }
                }

                // Helper functions for collapsing and expanding nodes.

                function collapse(d) {
                    if (d.children) {
                        d._children = d.children;
                        d._children.forEach(collapse);
                        d.children = null;
                    }
                }

                function expand(d) {
                    if (d._children) {
                        d.children = d._children;
                        d.children.forEach(expand);
                        d._children = null;
                    }
                }

                var overCircle = function(d) {
                    selectedNode = d;
                    updateTempConnector();
                };
                var outCircle = function(d) {
                    selectedNode = null;
                    updateTempConnector();
                };

                // Function to update the temporary connector indicating dragging affiliation
                var updateTempConnector = function() {
                    var data = [];
                    if (draggingNode !== null && selectedNode !== null) {
                        // have to flip the source coordinates since we did this for the existing connectors on the original tree
                        data = [{
                            source: {
                                x: selectedNode.y0,
                                y: selectedNode.x0
                            },
                            target: {
                                x: draggingNode.y0,
                                y: draggingNode.x0
                            }
                        }];
                    }
                    var link = svgGroup.selectAll(".templink").data(data);

                    link.enter().append("path")
                        .attr("class", "templink")
                        .attr("d", d3.svg.diagonal())
                        .attr('pointer-events', 'none');

                    link.attr("d", d3.svg.diagonal());

                    link.exit().remove();
                };

                // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

                function centerNode(source) {
                    scale = zoomListener.scale();
                    x = -source.y0;
                    y = -source.x0;
                    x = x * scale + viewerWidth / 2;
                    y = y * scale + viewerHeight / 2;
                    d3.select('g').transition()
                        .duration(duration)
                        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
                    zoomListener.scale(scale);
                    zoomListener.translate([x, y]);
                }

                // Toggle children function

                function toggleChildren(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else if (d._children) {
                        d.children = d._children;
                        d._children = null;
                    }
                    return d;
                }

                // Toggle children on click.

                function click(d) {
                    if (d3.event.defaultPrevented) return; // click suppressed
                    d = toggleChildren(d);
                    $scope.temp=d
                    // centerNode(d);
                    $scope.user.name=d.name
                    $scope.user.title=d.name
                    $scope.user.age=d.name
                    $scope.user.other=d.name
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    update(d);
                    
                }
                
                $scope.temp={}
                $scope.$watch("user",function(newVal,oldVal){
                  $scope.temp.name=newVal.name
                  update($scope.temp)
                },true)
                function update(source) {
                    // Compute the new height, function counts total children of root node and sets tree height accordingly.
                    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
                    // This makes the layout more consistent.
                    // var levelWidth = [1];
                    // var childCount = function(level, n) {

                    //     if (n.children && n.children.length > 0) {
                    //         if (levelWidth.length <= level + 1) levelWidth.push(0);

                    //         levelWidth[level + 1] += n.children.length;
                    //         n.children.forEach(function(d) {
                    //             childCount(level + 1, d);
                    //         });
                    //     }
                    // };
                    // childCount(0, root);
                    // var newHeight = d3.max(levelWidth) * 25;  
                    // tree = tree.size([newHeight, viewerWidth]);
                    tree = tree.nodeSize([rectW*1.5, 20])
                        // Compute the new tree layout.
                        console.log(root)
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);
                    // Set widths between levels based on maxLabelLength.
                    nodes.forEach(function(d) {
                        d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                        // alternatively to keep a fixed scale one can set a fixed depth per level
                        // Normalize for fixed-depth by commenting out below line
                        // d.y = (d.depth * 500); //500px per level.
                    });
                    // Update the nodes…
                    node = svgGroup.selectAll("g.node")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .call(dragListener)
                        .attr("class", "node user-info")
                        .attr("transform", function(d) {
                            return "translate(" + source.x0 + "," + source.y0 + ")";
                        })
                        .on('click', click)
                        .on('contextmenu', d3.contextMenu(menu));

                    // nodeEnter.append("circle")
                    //     .attr('class', 'nodeCircle')
                    //     .attr("r", 0)
                    //     .style("fill", function(d) {
                    //         return d._children ? "lightsteelblue" : "#fff";
                    //     });
                    // nodeEnter.append("rect")
                    //     .attr("width", rectW)
                    //     .attr("height", rectH)
                    //     .attr("dy", ".35em")
                    //     .attr("stroke", "black")
                    //     .attr("stroke-width", 1)
                    //     .style("fill", function(d) {
                    //         return d._children ? "lightsteelblue" : "#fff";
                    //     })
                        // nodeEnter.append("text")
                        //     .attr("x", function(d) {
                        //         return d.children || d._children ? -10 : 10;
                        //     })
                        //     .attr("dy", ".35em")
                        //     .attr('class', 'nodeText')
                        //     .attr("text-anchor", function(d) {
                        //         return d.children || d._children ? "end" : "start";
                        //     })
                        //     .text(function(d) {
                        //         return d.name;
                        //     })
                        //     .style("fill-opacity", 0);

                    nodeEnter.append("rect")
                    nodeEnter.append("text")
                    nodeEnter.selectAll("g.user-info text")
                        .append("tspan")
                        .attr("class","user-info__title")
                        .attr("x",rectW/2)
                        .attr("dy","1em")
                        .attr("text-anchor","middle")
                        .text(function(d){
                          return "Title:"+d.name;
                        })
                    node.selectAll("g.node tspan.user-info__title")
                        .text(function(d){
                          return "Title:"+d.name;
                        })
                    nodeEnter.selectAll("g.user-info text")
                        .append("tspan")
                        .attr("class","user-info__name")
                        .attr("x",rectW/2)
                        .attr("dy","2em")
                        .attr("text-anchor","middle")
                        .text(function(d){
                          return "Name:"+d.name;
                        })
                    node.selectAll("g.node tspan.user-info__name")
                        .text(function(d){
                          return "Title:"+d.name;
                        })
                    nodeEnter.selectAll("g.user-info text")
                        .append("tspan")
                        .attr("class","user-info__age")
                        .attr("x",rectW/2)
                        .attr("dy","2em")
                        .attr("text-anchor","middle")
                        .text(function(d){
                          return "Age:"+d.name;
                        })
                    node.selectAll("g.node tspan.user-info__age")
                        .text(function(d){
                          return "Title:"+d.name;
                        })
                    nodeEnter.selectAll("g.user-info text")
                        .append("tspan")
                        .attr("class","user-info__other")
                        .attr("x",rectW/2)
                        .attr("dy","2em")
                        .attr("text-anchor","middle")
                        .text(function(d){
                          return "Other:"+d.name;
                        })
                    node.selectAll("g.node tspan.user-info__ohter")
                        .text(function(d){
                          return "Title:"+d.name;
                        })
                    nodeEnter.selectAll("g.node rect")
                        .attr('rx', 5)
                        .attr('ry', 5)
                        // .attr("width",function(d,j,x){
                        //   var text=d3.selectAll('g.user-info text');
                        //   rectWidth=text[0][x].clientWidth;
                        //   return rectWidth;
                        // })
                        .attr("width",rectW)
                        .attr("height",rectH)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .style("fill", function(d) {
                            // return d._children ? "lightsteelblue" : "#fff";
                            if(d._children){
                              if(d.depth==0) return "#c30505";
                              if(d.depth==1) return "#03a9f4";
                              if(d.depth==2) return "#a634b9";
                              if(d.depth==3) return "#009688";
                            }else{return "#fff"}
                        })

                    // phantom node to give us mouseover in a radius around it
                    // nodeEnter.append("circle")
                    //     .attr('class', 'ghostCircle')
                    //     .attr("r", 30)
                    //     .attr("opacity", 0.2) // change this to zero to hide the target area
                    // .style("fill", "red")
                    //     .attr('pointer-events', 'mouseover')
                    //     .on("mouseover", function(node) {
                    //         overCircle(node);
                    //     })
                    //     .on("mouseout", function(node) {
                    //         outCircle(node);
                    //     });
                    nodeEnter.append("rect")
                        .attr("class", "ghostCircle")
                        .attr("width", rectW+20)
                        .attr("height", rectH+20)
                        .attr("opacity", 0.2)
                        .style("fill", "red")
                        .attr("pointer-events", "mouseover")
                        .on("mouseover", function(node) {
                            overCircle(node);
                        })
                        .on("mouseout", function(node) {
                            outCircle(node);
                        })


                    // Update the text to reflect whether node has children or not.
                    // node.select('text')
                    //     .attr("x", function(d) {
                    //         return d.children || d._children ? -10 : 10;
                    //     })
                    //     .attr("text-anchor", function(d) {
                    //         return d.children || d._children ? "end" : "start";
                    //     })
                    //     .text(function(d) {
                    //         return d.name;
                    //     });

                    // Change the circle fill depending on whether it has children and is collapsed
                    // node.select("circle.nodeCircle")
                    //     .attr("r", 4.5)
                    //     .style("fill", function(d) {
                    //         return d._children ? "lightsteelblue" : "#fff";
                    //     });



                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });
                    nodeUpdate.select("rect")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .style("fill", function(d) {
                            // return d._children ? "lightsteelblue" : "#fff";
                            if(d._children){
                              if(d.depth==0) return "#c30505";
                              if(d.depth==1) return "#03a9f4";
                              if(d.depth==2) return "#a634b9";
                              if(d.depth==3) return "#009688";
                            }else{return "#fff"}
                        });
                    // Fade the text in
                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + source.x + "," + source.y + ")";
                        })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 0);

                    nodeExit.select("text")
                        .style("fill-opacity", 0);

                    // Update the links…
                    var link = svgGroup.selectAll("path.link")
                        .data(links, function(d) {
                            return d.target.id;
                        });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("x", rectW / 2)
                        .attr("y", rectH / 2)
                        .attr("d", function(d) {
                            var o = {
                                x: source.x0,
                                y: source.y0
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        });

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function(d) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                // Append a group which holds all nodes and which the zoom Listener can act upon.
                var svgGroup = baseSvg.append("g");

                // Define the root
                root = $scope.data  //treeData
                root.y0 = viewerHeight / 2;
                root.x0 = 0;

                // Layout the tree initially and center on the root node.
                root.children.forEach(collapse);
                update(root);
                centerNode(root);
            // })
        })
    }}})
    
