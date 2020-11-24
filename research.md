---
layout: page
title:  研究方向
cover:  false
menu:   true
order:  4
---
##  **专利信息抽取**
*  ### **抽取专利文本中的命名实体和语义关系，并用于技术功效矩阵的自动生成** 
<img src="./scientific_writing_styles/syntactic_complexity.jpg" alt="Distribution of Syntactic Complexity" align="left" width="70%"/>
专利信息抽取是大数据时代专利文本分析的基础技术，然而目前专利信息抽取方法依然依赖人工规则和第三方文本挖掘工具，成本高、效率低、主观性强、真实效果难以测度。对此，我们做了两件事情：(1)创建一套包含命名实体和语义关系标注的专利摘要数据集，以缓解当前专利标注数据集稀缺的问题；(2)将前沿信息抽取技术，即深度学习技术作为核心模块引入专利信息抽取方法研究中来，以有监督学习模式从标引数据中学习信息抽取规则，并以测试集作为金标准，采用定量方式来测度抽取效果。实验结果对比分析显示，新方法不仅自动化程度较高、抽取信息的类型丰富，而且在抽取结果的正确程度上远超传统SAO方法。
<img src="./scientific_writing_styles/technology-function.jpg" alt="Distribution of Syntactic Complexity" align="left" width="70%"/>
我们在1576篇专利摘要上利用新方法进行信息抽取并创建技术功效矩阵。相比传统人工方法，新方法不仅可以有效应对大数据时代的信息过载问题，消除对专家资源的依赖，产生的技术功效矩阵具有客观、准确、高效。
此外，我们注意到深度学习方法相对传统方法，在信息抽取效果上虽然表现出明显优势，但也留下了巨大的提升空间。最明显的就是，无论BiLSTM-CRF还是BiGRU-HAN，均为信息抽取的通用模型，并未针对专利文本的独有特点进行设计和优化。实际上，这正是当前人工智能技术向专业领域渗透过程中面临的突出问题，即人工智能技术在专业领域本地化环节上的缺失。回到信息抽取上，要解决人工智能技术在专利挖掘上的本地化，不仅需要研究者深度理解专利的特殊性，更要将其合理地抽象成模型语言和特征表示，并获得超出通用模型的预测结果。因此，我们以信息抽取的关键环节-语义关系分类为例，对深度学习如何在专利领域本地化展开探索并给出我们的方案。

>Chao Lu, Yi Bu, Jie Wang, Ying Ding, Vetle Torvik, Matthew Schnaars, Chengzhi Zhang\*. Examining scientific writing styles from the perspective of linguistic complexity. ***Journal of the Association for Information Science and Technology***, 2019, 70(5):462-475.  [[doi]](https://onlinelibrary.wiley.com/doi/10.1002/asi.24126)
>**Chen, L.**, Xu, S*., Zhu, L. et al. A deep learning based method for  extracting semantic information from patent documents. Scientometrics  125, 289–312 (2020).  [[doi]](https://doi.org/10.1007/s11192-020-03634-y)

*  ### **专利关键词抽取方法研究** 
<img src="./scientific_writing_styles/CAKET.jpg" alt="Distribution of Syntactic Complexity" align="left" width="70%"/>
相比论文题录中包含明确的关键词信息，专利信息所提供的标注信息相对含混晦涩。首先，专利文献并不提供关键词列表辅助读者理解专利内容；其次，虽然每个专利都具有技术分类编码信息，然而这些编码所依附的技术分类体系一是粒度相对粗糙，二是与专利文本中实体、概念的对应关系不明，三是与技术发展前沿存在时滞，因而无法依靠技术分类编码快速批量了解专利内容。在本章中，我们在主题模型的框架内，使用两种方法对专利信息进行智能标注，以帮助用户快速批量解读专利内容，其一是以unigram方法从专利数据集中学习到技术分类号所对应的主题词汇列表，从而将粗糙的技术分类信息细化为具体的专利词汇；其二是针对专利文本中存在较多词组型实体、概念的现象，我们将前述方法升级到ngram，使其不仅可以学习到技术分类号所对应的主题词汇列表，而且具有一定的关键词抽取能力。

##  **技术演化路径分析**

*  ### **Using the Full-text Content of Academic Articles to Identify and Evaluate Algorithm Entities in the Domain of Natural Language Processing** 
[<img src="./algorithm_entity/algorithm.jpg" alt="Algorithm Influence in NLP (1979~2015)" align="left" width="70%"/>](https://chengzhizhang.github.io/research/algorithm_entity/algorithm_influence.html) 
Taking NLP as an example, we manually annotate the more algorithm entities with specific names in academic papers, and evaluate the influence of the algorithm based on the number of papers mentioning an algorithm and duration of mention. We analyze the changes of the algorithms with high impact in different years, and explore the evolution of the algorithm influence over time. Algorithm entities and sentences mentioning these algorithms identified by this work can be used as a training corpus for automatic extraction of the algorithmic entities. 

>Yuzhuo Wang, Chengzhi Zhang\*. Using the Full-text Content of Academic Articles to Identify and Evaluate Algorithm Entities in the Domain of Natural Language Processing. ***Journal of Informetrics***, 2020, 14(2): 101091.[[doi]](https://doi.org/10.1016/j.joi.2020.101091)   [[Demo: Algorithm Influence in NLP (1979~2015)]](https://chengzhizhang.github.io/research/algorithm_entity/algorithm_influence.html)   [[Video](https://chengzhizhang.github.io/research/algorithm_entity/video.html)]

##  **知识产权领域的智慧法律** 

*  ### **Enhancing Keyphrase Extraction from Microblogs using Human Reading Time** 
<img src="./keyphrase_extraction/Attention-Mechanism.jpg" alt="Attention-mechanism-based keyphrase extraction models" align="left" width="70%"/>
We aim to leverage human reading time to extract keyphrases from microblog posts. There are two main tasks in this study. One is to determine how to measure the time spent by a human on reading a word. We use eye fixation durations extracted from an open source eye-tracking corpus (OSEC). Moreover, we propose strategies to make eye fixation duration more effective on keyphrase extraction. The other task is to determine how to integrate human reading time into keyphrase extraction models. We propose two novel neural network models. The first is a model in which the human reading time is used as the ground truth of the attention mechanism. In the second model, we use human reading time as the external feature.

>Yingyi Zhang, Chengzhi Zhang\*. Enhancing Keyphrase Extraction from Microblogs using Human Reading Time. ***Journal of the Association for Information Science and Technology***, 2021. (in press) [[doi]](http://doi.org/10.1002/asi.24430)  [[arxiv]](https://arxiv.org/abs/2010.09934)

*  ### **Joint Modeling of Characters, Words, and Conversation Contexts for Microblog Keyphrase Extraction** 
<img src="./keyphrase_extraction/heatmap.jpg" alt="The Heatmap of the Context Representation" align="left" width="70%"/>
We propose a neural keyphrase extraction framework for microblog posts. The framework consists of two modules: a conversation context encoder and a keyphrase tagger. Conversation context encoders are utilized to encode conversation
context to help keyphrase taggers indicate salient phrases. The keyphrase tagger is employed to extract keyphrases from target posts. To leverage the structure of conversation, the hierarchical encoder is employed to learn the word-level and message-level information from a conversation context. To alleviate the OOV problem in usergenerated content on social media platforms, we utilized the character-level word embedding to capture both characterlevel and word-level features in both conversation context encoders and keyphrase taggers.

>Yingyi Zhang, Chengzhi Zhang\*, Jing Li. Joint Modeling of Characters, Words, and Conversation Contexts for Microblog Keyphrase Extraction. ***Journal of the Association for Information Science and Technology***, 2020, 71(5):553-567. [[doi]](https://onlinelibrary.wiley.com/doi/full/10.1002/asi.24279)

*  ### **Using social media to explore regional cuisine preferences in China**
[<img src="./cuisine_preferences/cuisine_preferences.jpg" alt="Rgional Cuisine Preferences in China" align="left" width="70%"/>](https://chengzhizhang.github.io/research/cuisine_preferences/results.html) 
Based on both UGC and online recipes, we first investigated the cuisine preference distribution in different regions. Then, dish preference similarity between regions was calculated and few geographic factors were identified, which might lead to such regional similarity appeared in our study. By applying hierarchical clustering, we clustered regions based on dish preference and ingredient usage separately.Different from traditional definitions of regions to which cuisine belong, we found new association between region and cuisine based on dish preference from social media and ingredient usage of dishes. Using social media may overcome problems with using traditional questionnaires, such as high costs and long cycle for questionnaire design and answering.

>Chengzhi Zhang, Zijing Yue, Qingqing Zhou, Shutian Ma, Zike Zhang. Using social media to explore regional cuisine preferences in China. ***Online Information Review***. 2019, 43(7): 1098-1114. [[doi]](https://doi.org/10.1108/OIR-08-2018-0244)  [[Demo]](https://chengzhizhang.github.io/research/cuisine_preferences/results.html)