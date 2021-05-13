# Kikoeru WebUI

## Components

### Game

duolingo-like puzzle UI

#### Input

name | type | comments
-- | -- | --
type | string | "input": 填空题 "selection": 选择题
getAudioURL? | string | 语音文件URL
selection? | string[] | 选项
answer | string | 答案
onAnswered | (bool) => void | 答题完成后回调，参数为本题对错
