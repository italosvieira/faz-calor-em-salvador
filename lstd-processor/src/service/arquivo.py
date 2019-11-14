# import os
# import psycopg2
# from . import metadados as metadados_service
# from . import dados_cientificos as dados_cientificos_service
#
#
# def save(metadados, dados_processados):
#     conexao = None
#     cursor = None
#
#     try:
#         conexao = psycopg2.connect(host=os.environ["POSTGRES_HOST"], dbname=os.environ["POSTGRES_DB"],
#                                    user=os.environ["POSTGRES_USER"], password=os.environ["POSTGRES_PASSWORD"])
#         cursor = conexao.cursor()
#
#         metadados_service.save(cursor, metadados)
#
#         dados_processados["id_metadados"] = metadados_service.get_medatados_id_by_nome_arquivo(cursor,
#                                                                                                metadados["nome_arquivo"])
#         dados_cientificos_service.save(cursor, metadados)
#
#         conexao.commit()
#         cursor.close()
#         conexao.close()
#     except Exception as e:
#         if cursor is not None:
#             cursor.close()
#         if conexao is not None:
#             conexao.rollback()
#             conexao.close()
#         print("")
