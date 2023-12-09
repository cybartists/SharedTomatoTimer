# 使用Python作为基础镜像
FROM python:3.8
LABEL authors="cybartist"

# 设置工作目录
WORKDIR /app

# 将当前目录下的所有文件复制到工作目录
COPY . .

# 安装依赖
RUN pip install -r requirements.txt

# 暴露端口
EXPOSE 80

# 运行应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
