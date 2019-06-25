using Dapper;
using IdeconCashFlow.Business.RepositoryFolder.BaseRepositoryFolder;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IdeconCashFlow.Business.RepositoryFolder.DapperFolder
{
    public class DapperRepository : BaseRepository, IDapperRepository
    {
        const string mySqlConnString = @"server=localhost;database=IdeconCashflowDapperDb;user=root;password=Idecon1*";
        //const string msSqlConnString = @"Data Source=.\SQLEXPRESS;Initial Catalog=IdeconCashFlowDatabase;Integrated Security=True";

        public virtual void Insert<T>(T entity)
        {
            var columns = GetColumns<T>();
            var stringOfColumns = string.Join(", ", columns);
            var stringOfParameters = string.Join(", ", columns.Select(e => "@" + e));
            var query = $"insert into {typeof(T).Name}Table ({stringOfColumns}) values ({stringOfParameters})";

            using (var conn = new MySqlConnection(mySqlConnString))
            {
                conn.Open();
                conn.Execute(query, entity);
            }
        }

        public virtual void Delete<T>(T entity)
        {
            var query = $"delete from {typeof(T).Name}s where Id = @Id";

            using (var connection = new MySqlConnection(mySqlConnString))
            {
                connection.Open();
                connection.Execute(query, entity);
            }
        }

        public virtual void Update<T>(T entity)
        {
            var columns = GetColumns<T>();
            var stringOfColumns = string.Join(", ", columns.Select(e => $"{e} = @{e}"));
            var query = $"update {typeof(T).Name}s set {stringOfColumns} where Id = @Id";

            using (var connection = new MySqlConnection(mySqlConnString))
            {
                connection.Open();
                connection.Execute(query, entity);
            }
        }

        public virtual IEnumerable<T> Query<T>(string query)
        {
            if (!string.IsNullOrWhiteSpace(query))
            {
                using (var connection = new MySqlConnection(mySqlConnString))
                {
                    try
                    {
                        connection.Open();
                        return connection.Query<T>(query);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception(GetExceptionMessage(ex));
                    }
                }
            }
            else
                throw new Exception($"Query must be valid! Query: {query}");
        }


        public virtual int Execute(string query)
        {
            if (!string.IsNullOrWhiteSpace(query))
            {
                using (var connection = new MySqlConnection(mySqlConnString))
                {
                    try
                    {
                        connection.Open();
                        return connection.Execute(query);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception(GetExceptionMessage(ex));
                    }
                }
            }
            else
                throw new Exception($"Query must be valid! Query: {query}");
        }

        private IEnumerable<string> GetColumns<T>()
        {
            return typeof(T)
                    .GetProperties()
                    .Where(e => e.Name != "Id" && !e.PropertyType.GetTypeInfo().IsGenericType)
                    .Select(e => e.Name);
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~DapperRepository() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion


    }
}

