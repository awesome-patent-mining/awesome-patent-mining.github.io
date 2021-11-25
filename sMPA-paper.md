---
layout: page
title:  Experimental results
cover:  false
menu:   false
order:  6
---

  To demonstrate the advantages of the semantic MPA, extensive experiments are conducted on a patent dataset pertaining to lithium-ion battery in electric vehicle. By running DP-BFS algorithm and clustering the resulting candidate paths with their attached documents, the density peak clustering method finds the correct number of clusters and outputs  the center of each cluster as the 1st row  in Fig. 9. And the path(s) with the largest topological weight in each cluster is chosen to represent the developmental trajectory of the resulting cluster, viz. main path(s) as depicted in the 2st row in Fig. 9.
<img src="./cluster_sem_top_centroid_20211117.png" alt="Distribution of Syntactic Complexity" align="middle" width="100%"/>
**Fig. 9** The semantic distribution of candidate paths.

  To obtain some insights about the sMPA, the main paths in cases of β=0/0.05/1 are presented in Fig. 11, where paths with equal topological weight are merged into one path. 
<img src="./main_paths.jpg" alt="Distribution of Syntactic Complexity" align="middle" width="100%"/>
**Fig. 11** The detail information of main paths in different sub-fields

---
**The detailed information of the main paths for β=0/0.05/1 is provided as below:**

[[The detailed information of main paths when β=0](https://awesome-patent-mining.github.io/beta_0/)]

[[The detailed information of main paths when β=0.05](https://awesome-patent-mining.github.io/beta_005/)]

[[The detailed information of main paths when β=1](https://awesome-patent-mining.github.io/beta_1/)]