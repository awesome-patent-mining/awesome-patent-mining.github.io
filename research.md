---
layout: page
title:  Research
cover:  false
menu:   true
order:  2
---
##  **Scientific Text Mining**
*  ### **Examining scientific writing styles from the perspective of linguistic complexity** 
<img src="./scientific_writing_styles/syntactic_complexity.jpg" alt="Distribution of Syntactic Complexity" align="left" width="70%"/>
To uncover the differences in English scientific writing between native English-speaking scholars (NESs) and non-native English-speaking scholars (NNESs), we collected a large-scale data set containing more than 150,000 full-text articles published in PLoS between 2006 and 2015. We divided these articles into three groups according to the ethnic backgrounds of the first and corresponding authors, obtained by Ethnea, and examined the scientific writing styles in English from a two-fold perspective of inguistic complexity: syntactic and lexical complexity. The observations suggest marginal differences between groups in syntactical and lexical complexity.

>Chao Lu, Yi Bu, Jie Wang, Ying Ding, Vetle Torvik, Matthew Schnaars, Chengzhi Zhang\*. Examining scientific writing styles from the perspective of linguistic complexity. ***Journal of the Association for Information Science and Technology***, 2019, 70(5):462-475.  [[doi]](https://onlinelibrary.wiley.com/doi/10.1002/asi.24126)


##  **Knowledge Entity Extraction and Evaluation**

*  ### **Using the Full-text Content of Academic Articles to Identify and Evaluate Algorithm Entities in the Domain of Natural Language Processing** 
[<img src="./algorithm_entity/algorithm.jpg" alt="Algorithm Influence in NLP (1979~2015)" align="left" width="70%"/>](https://chengzhizhang.github.io/research/algorithm_entity/algorithm_influence.html) 
Taking NLP as an example, we manually annotate the more algorithm entities with specific names in academic papers, and evaluate the influence of the algorithm based on the number of papers mentioning an algorithm and duration of mention. We analyze the changes of the algorithms with high impact in different years, and explore the evolution of the algorithm influence over time. Algorithm entities and sentences mentioning these algorithms identified by this work can be used as a training corpus for automatic extraction of the algorithmic entities. 

>Yuzhuo Wang, Chengzhi Zhang\*. Using the Full-text Content of Academic Articles to Identify and Evaluate Algorithm Entities in the Domain of Natural Language Processing. ***Journal of Informetrics***, 2020, 14(2): 101091.[[doi]](https://doi.org/10.1016/j.joi.2020.101091)   [[Demo: Algorithm Influence in NLP (1979~2015)]](https://chengzhizhang.github.io/research/algorithm_entity/algorithm_influence.html)   [[Video](https://chengzhizhang.github.io/research/algorithm_entity/video.html)]

##  **Social Media Mining** 

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